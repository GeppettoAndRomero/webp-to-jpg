/**
 * WebP → JPG/PNG conversion (main thread).
 *
 * WebP is decoded natively by the browser (no WASM, no worker needed), so this
 * runs on the main thread via an <img> + <canvas> — works
 * on every modern browser including older Safari (no OffscreenCanvas dependency).
 *
 * Correctness points (TOOL-ADAPTATION-PLAYBOOK "looks-working ≠ works"):
 *  - JPG has no alpha → transparent pixels are matted onto WHITE (canvas defaults to
 *    black for JPEG). PNG keeps alpha.
 *  - EXIF orientation: drawing via an <img> applies the browser's orientation handling.
 *  - Animated WebP: the <img> yields the first (poster) frame.
 *  - Quality slider feeds canvas.toBlob's quality arg, so output size actually changes.
 */

import { computeTargetDims, generateFileName } from '@/workers/imagePipeline';
import type { ConversionSettings } from './settings';

export interface ConvertResult {
  blob: Blob;
  outputFileName: string;
  width: number;
  height: number;
  originalSize: number;
  outputSize: number;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to decode image (unsupported or corrupt WebP)'));
    };
    img.src = url;
  });
}

export async function convertImage(
  file: File,
  settings: ConversionSettings
): Promise<ConvertResult> {
  const img = await loadImage(file);
  const srcW = img.naturalWidth;
  const srcH = img.naturalHeight;
  if (!srcW || !srcH) throw new Error('Image has no dimensions');

  const { width, height } = computeTargetDims(srcW, srcH, settings);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get 2D canvas context');

  const type = settings.outputFormat === 'jpeg' ? 'image/jpeg' : 'image/png';
  // JPG cannot store alpha; matte transparency onto white before drawing.
  if (type === 'image/jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, srcW, srcH, 0, 0, width, height);

  const quality = settings.outputFormat === 'jpeg' ? settings.jpegQuality : undefined;
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Failed to encode image'))),
      type,
      quality
    );
  });

  return {
    blob,
    outputFileName: generateFileName(file.name, settings),
    width,
    height,
    originalSize: file.size,
    outputSize: blob.size,
  };
}
