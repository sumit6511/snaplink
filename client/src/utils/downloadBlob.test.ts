import { afterEach, describe, expect, it, vi } from 'vitest';
import { downloadBlob } from './downloadBlob';

// jsdom doesn't implement URL.createObjectURL/revokeObjectURL at all, so
// there's nothing for vi.spyOn to attach to — stub them directly instead.
describe('downloadBlob', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    Reflect.deleteProperty(URL, 'createObjectURL');
    Reflect.deleteProperty(URL, 'revokeObjectURL');
  });

  it('creates an object URL, clicks a download link, and revokes the URL', () => {
    const objectUrl = 'blob:mock-url';
    URL.createObjectURL = vi.fn().mockReturnValue(objectUrl);
    URL.revokeObjectURL = vi.fn();
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    downloadBlob(new Blob(['a,b\r\n1,2\r\n'], { type: 'text/csv' }), 'export.csv');

    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith(objectUrl);
  });

  it('sets the anchor href and download attributes before clicking', () => {
    URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url');
    URL.revokeObjectURL = vi.fn();

    let capturedHref = '';
    let capturedDownload = '';
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
      this: HTMLAnchorElement,
    ) {
      capturedHref = this.href;
      capturedDownload = this.download;
    });

    downloadBlob(new Blob(['x']), 'links.csv');

    expect(capturedHref).toBe('blob:mock-url');
    expect(capturedDownload).toBe('links.csv');
  });
});
