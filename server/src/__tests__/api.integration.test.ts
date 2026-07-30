import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../app';
import { startTestDb, stopTestDb } from '../test/dbMemoryServer';

const app = createApp();

beforeAll(async () => {
  await startTestDb();
});

afterAll(async () => {
  await stopTestDb();
});

describe('SnapLink API', () => {
  let accessToken: string;
  let linkId: string;
  let shortCode: string;

  it('registers a new user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'password123',
    });
    expect(res.status).toBe(201);
    expect(res.body.data.user.email).toBe('ada@example.com');
    expect(res.body.data.user.password).toBeUndefined();
    accessToken = res.body.data.accessToken;
  });

  it('rejects duplicate registration', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'password123',
    });
    expect(res.status).toBe(409);
  });

  it('rejects registration with an invalid payload', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'A', email: 'not-an-email', password: 'short' });
    expect(res.status).toBe(400);
  });

  it('logs in with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ada@example.com', password: 'password123' });
    expect(res.status).toBe(200);
    accessToken = res.body.data.accessToken;
  });

  it('rejects login with the wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ada@example.com', password: 'wrongpassword' });
    expect(res.status).toBe(401);
  });

  it('fetches the authenticated user profile', async () => {
    const res = await request(app)
      .get('/api/user/profile')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.user.name).toBe('Ada Lovelace');
  });

  it('rejects profile access without a token', async () => {
    const res = await request(app).get('/api/user/profile');
    expect(res.status).toBe(401);
  });

  it('creates a shortened link', async () => {
    const res = await request(app)
      .post('/api/links')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ originalUrl: 'https://example.com/some/very/long/path', title: 'Example' });
    expect(res.status).toBe(201);
    expect(res.body.data.link.shortCode).toHaveLength(7);
    expect(res.body.data.link.qrCode).toMatch(/^data:image\/png;base64,/);
    linkId = res.body.data.link.id;
    shortCode = res.body.data.link.shortCode;
  });

  it('rejects an invalid URL', async () => {
    const res = await request(app)
      .post('/api/links')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ originalUrl: 'not-a-url' });
    expect(res.status).toBe(400);
  });

  it("lists the owner's links with pagination", async () => {
    const res = await request(app)
      .get('/api/links?page=1&limit=10')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.links).toHaveLength(1);
    expect(res.body.data.pagination.total).toBe(1);
  });

  it('updates the link with a custom alias', async () => {
    const res = await request(app)
      .put(`/api/links/${linkId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ customAlias: 'ada-link' });
    expect(res.status).toBe(200);
    expect(res.body.data.link.customAlias).toBe('ada-link');
  });

  it('redirects using the custom alias and records a click', async () => {
    const res = await request(app).get('/ada-link');
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('https://example.com/some/very/long/path');
  });

  it('redirects using the original short code too', async () => {
    const res = await request(app).get(`/${shortCode}`);
    expect(res.status).toBe(302);
  });

  it('returns 404 for an unknown short code', async () => {
    const res = await request(app).get('/does-not-exist-xyz');
    expect(res.status).toBe(404);
  });

  it('returns analytics with the recorded clicks', async () => {
    const res = await request(app)
      .get(`/api/analytics/${linkId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.summary.totalClicks).toBe(2);
    expect(res.body.data.clickHistory).toHaveLength(2);
    expect(res.body.data.timeseries.daily).toHaveLength(30);
    expect(res.body.data.timeseries.monthly).toHaveLength(12);
  });

  it("prevents another user from accessing someone else's link", async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Grace Hopper',
      email: 'grace@example.com',
      password: 'password123',
    });
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'grace@example.com', password: 'password123' });
    const otherToken = loginRes.body.data.accessToken;

    const res = await request(app)
      .get(`/api/links/${linkId}`)
      .set('Authorization', `Bearer ${otherToken}`);
    expect(res.status).toBe(404);
  });

  it('deletes the link', async () => {
    const res = await request(app)
      .delete(`/api/links/${linkId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(204);
  });

  it('no longer resolves the deleted link', async () => {
    const res = await request(app).get('/ada-link');
    expect(res.status).toBe(404);
  });
});
