import { describe, it, expect } from 'vitest';
import {
  validateFileExtension,
  validateFileMimeType,
  validateFile,
  validateTotalSize,
  sanitizeFileName,
} from '@/utils/fileValidation';

// Minimal File-like stub (only the fields the validators read).
const f = (name: string, type = '', size = 1): File =>
  ({ name, type, size }) as unknown as File;

describe('validateFileExtension', () => {
  it('accepts .webp regardless of case', () => {
    expect(validateFileExtension('x.WEBP').valid).toBe(true);
  });

  it('rejects a non-webp extension', () => {
    expect(validateFileExtension('x.heic').valid).toBe(false);
    expect(validateFileExtension('x.png').valid).toBe(false);
  });
});

describe('validateFileMimeType', () => {
  it('accepts the WebP mime type', () => {
    expect(validateFileMimeType(f('x.webp', 'image/webp')).valid).toBe(true);
  });

  it('accepts an empty mime type (relies on extension)', () => {
    expect(validateFileMimeType(f('x.webp', '')).valid).toBe(true);
  });

  it('rejects a non-WebP mime type', () => {
    expect(validateFileMimeType(f('x.webp', 'image/png')).valid).toBe(false);
  });
});

describe('validateFile', () => {
  it('accepts a valid WebP file', () => {
    expect(validateFile(f('photo.webp', 'image/webp')).valid).toBe(true);
  });

  it('rejects a file with an unsupported extension', () => {
    expect(validateFile(f('photo.png', 'image/png')).valid).toBe(false);
  });
});

describe('validateTotalSize', () => {
  it('accepts files under the 2GB cap', () => {
    expect(validateTotalSize([f('a.webp', 'image/webp', 10 * 1024 * 1024)]).valid).toBe(true);
  });

  it('rejects when the combined size exceeds the cap', () => {
    expect(
      validateTotalSize([
        f('a.webp', 'image/webp', 2 * 1024 * 1024 * 1024),
        f('b.webp', 'image/webp', 1),
      ]).valid
    ).toBe(false);
  });
});

describe('sanitizeFileName', () => {
  it('replaces path and reserved characters with underscores', () => {
    expect(sanitizeFileName('a/b\\c:d*e?.webp')).toBe('a_b_c_d_e_.webp');
  });
});
