import { Resend } from 'resend';
import { env } from '../config/env';
import { logger } from '../config/logger';

let resendClient: Resend | null = null;

function getClient(): Resend | null {
  if (!env.RESEND_API_KEY) return null;
  resendClient ??= new Resend(env.RESEND_API_KEY);
  return resendClient;
}

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  // Logged directly in the no-API-key fallback below so the link is still
  // usable in local dev — without this, the flow would be untestable
  // without a real Resend key, since the html itself isn't printed.
  actionUrl: string;
}

// Without RESEND_API_KEY configured (local dev before it's set up, or CI),
// this logs instead of sending so the rest of the app keeps working rather
// than every registration/reset request failing on a missing credential.
async function sendEmail({ to, subject, html, actionUrl }: SendEmailParams): Promise<void> {
  const client = getClient();
  if (!client) {
    logger.warn(`RESEND_API_KEY not set — email not sent. To: ${to} | ${subject} | ${actionUrl}`);
    return;
  }

  const { error } = await client.emails.send({ from: env.EMAIL_FROM, to, subject, html });
  if (error) {
    logger.error(`Failed to send email to ${to}: ${error.message}`);
  }
}

function emailShell(title: string, bodyHtml: string): string {
  return `
    <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
      <h1 style="font-size: 20px; color: #111827; margin: 0 0 16px;">${title}</h1>
      ${bodyHtml}
      <p style="font-size: 13px; color: #9ca3af; margin-top: 32px;">— SnapLink</p>
    </div>
  `;
}

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  await sendEmail({
    to,
    subject: 'Reset your SnapLink password',
    actionUrl: resetUrl,
    html: emailShell(
      'Reset your password',
      `
        <p style="font-size: 14px; color: #4b5563; line-height: 1.6;">
          We received a request to reset your SnapLink password. This link expires in 1 hour.
          If you didn't request this, you can safely ignore this email.
        </p>
        <a href="${resetUrl}" style="display: inline-block; margin-top: 16px; padding: 10px 20px; background: #7c3aed; color: #ffffff; text-decoration: none; border-radius: 10px; font-size: 14px; font-weight: 600;">
          Reset password
        </a>
      `,
    ),
  });
}

export async function sendVerificationEmail(to: string, verifyUrl: string): Promise<void> {
  await sendEmail({
    to,
    subject: 'Verify your SnapLink email address',
    actionUrl: verifyUrl,
    html: emailShell(
      'Verify your email',
      `
        <p style="font-size: 14px; color: #4b5563; line-height: 1.6;">
          Confirm this is your email address to finish setting up your SnapLink account.
          This link expires in 24 hours.
        </p>
        <a href="${verifyUrl}" style="display: inline-block; margin-top: 16px; padding: 10px 20px; background: #7c3aed; color: #ffffff; text-decoration: none; border-radius: 10px; font-size: 14px; font-weight: 600;">
          Verify email
        </a>
      `,
    ),
  });
}
