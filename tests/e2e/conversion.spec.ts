import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { waitReady, convert } from './_helpers';

const isJpeg = (b: Buffer) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
const isPng = (b: Buffer) =>
  b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47;

test.describe('WebP conversion', () => {
  test('converts a WebP to an image in the browser with no upload', async ({ page }) => {
    const external: string[] = [];
    page.on('request', (req) => {
      const url = req.url();
      if (
        !url.startsWith('http://localhost:4321') &&
        !url.startsWith('data:') &&
        !url.startsWith('blob:')
      ) {
        external.push(url);
      }
    });

    await page.goto('/webp-to-jpg/');
    await waitReady(page);

    const download = await convert(page);
    const name = download.suggestedFilename();
    expect(name).toMatch(/\.(jpg|png)$/);

    const path = await download.path();
    expect(path).toBeTruthy();
    const buf = readFileSync(path as string);
    expect(buf.length).toBeGreaterThan(100);
    if (name.endsWith('.jpg')) expect(isJpeg(buf)).toBe(true);
    else expect(isPng(buf)).toBe(true);

    // no-upload covenant (TESTING.md E2E #1): nothing left the origin.
    expect(external, `unexpected cross-origin requests: ${external.join(', ')}`).toHaveLength(0);
  });
});
