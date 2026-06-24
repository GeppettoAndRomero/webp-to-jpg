import { type Page, type Download } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { readFileSync, readdirSync } from 'node:fs';

// Generic across tools: discover the input fixture at tests/fixtures/<dir>/sample.<ext>.
// Each tool ships its own (heic/sample.heic, webp/sample.webp, …); this helper stays
// frozen/identical and just picks up whatever the tool provides.
function findFixture(): { name: string; b64: string; mime: string } {
  const dir = fileURLToPath(new URL('../fixtures', import.meta.url));
  for (const sub of readdirSync(dir)) {
    let names: string[] = [];
    try {
      names = readdirSync(`${dir}/${sub}`);
    } catch {
      continue;
    }
    const f = names.find((n) => /^sample\./i.test(n));
    if (f) {
      const ext = f.split('.').pop()!.toLowerCase();
      const MIME: Record<string, string> = {
        webp: 'image/webp',
        heic: 'image/heic',
        heif: 'image/heif',
        png: 'image/png',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        zip: 'application/zip',
        pdf: 'application/pdf',
        mp4: 'video/mp4',
        mp3: 'audio/mpeg',
      };
      return {
        name: f,
        b64: readFileSync(`${dir}/${sub}/${f}`).toString('base64'),
        mime: MIME[ext] ?? 'application/octet-stream',
      };
    }
  }
  throw new Error('no tests/fixtures/*/sample.* fixture found');
}

const FIXTURE = findFixture();

/** Wait until the island has hydrated and the conversion subsystem is ready. */
export async function waitReady(page: Page) {
  await page.waitForFunction(() => (window as Record<string, unknown>).__toolReady === true);
}

/** Feed the tool's bundled input fixture through the drop-zone path; return the download. */
export async function convert(page: Page): Promise<Download> {
  const downloadPromise = page.waitForEvent('download', { timeout: 30_000 });
  await page.evaluate(
    ({ b64, name, mime }) => {
      const bin = atob(b64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      const file = new File([bytes], name, { type: mime });
      window.dispatchEvent(new CustomEvent('filesDropped', { detail: [file] }));
    },
    FIXTURE
  );
  return downloadPromise;
}
