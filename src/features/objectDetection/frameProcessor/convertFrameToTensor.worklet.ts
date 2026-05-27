// Worklet to convert a camera frame to an RGB tensor suitable for TFLite.
// This file is executed on the frame-processor worklet thread (JSI).
// It intentionally uses minimal runtime features and must be kept plain.

type FrameLike = {
  width?: number;
  height?: number;
  bytesPerRow?: number;
  pixelFormat?: 'rgb' | 'yuv' | 'unknown' | string;
  toArrayBuffer?: () => ArrayBuffer;
};

// @ts-ignore
export default function convertFrameToTensor(
  frame: FrameLike,
  width: number,
  height: number,
): number[] {
  'worklet';
  const srcW = Number(frame?.width) || 0;
  const srcH = Number(frame?.height) || 0;
  const bytesPerRow = Number(frame?.bytesPerRow) || 0;

  // Output is Uint8Array of length width*height*3 (RGB).
  const out = new Uint8Array(width * height * 3);
  if (!srcW || !srcH) {
    const fallback = new Array(out.length);
    for (let i = 0; i < out.length; i++) {
      fallback[i] = out[i];
    }
    return fallback;
  }

  try {
    const buffer = typeof frame?.toArrayBuffer === 'function' ? frame.toArrayBuffer() : null;
    if (!buffer) {
      const fallback = new Array(out.length);
      for (let i = 0; i < out.length; i++) {
        fallback[i] = out[i];
      }
      return fallback;
    }

    const bytes = new Uint8Array(buffer);
    if (bytes.length === 0) {
      const fallback = new Array(out.length);
      for (let i = 0; i < out.length; i++) {
        fallback[i] = out[i];
      }
      return fallback;
    }

    const targetRatio = width / height;
    let cropW = srcW;
    let cropH = srcH;
    if (srcW / srcH > targetRatio) {
      cropW = Math.round(srcH * targetRatio);
    } else {
      cropH = Math.round(srcW / targetRatio);
    }

    const cropX = Math.max(0, Math.floor((srcW - cropW) / 2));
    const cropY = Math.max(0, Math.floor((srcH - cropH) / 2));

    const xMap = new Int32Array(width);
    const yMap = new Int32Array(height);
    for (let x = 0; x < width; x++) {
      xMap[x] = cropX + Math.floor((x * cropW) / width);
    }
    for (let y = 0; y < height; y++) {
      yMap[y] = cropY + Math.floor((y * cropH) / height);
    }

    const estimatedBytesPerPixel = Math.max(1, Math.floor(bytes.length / (srcW * srcH)));
    const bytesPerPixelFromStride = bytesPerRow > 0 ? Math.max(1, Math.round(bytesPerRow / srcW)) : 0;
    const effectiveBytesPerPixel = bytesPerPixelFromStride || estimatedBytesPerPixel;
    // Treat as packed RGB only when both the pixel format and buffer layout match.
    const packedRgb = frame?.pixelFormat === 'rgb' && effectiveBytesPerPixel >= 3;

    if (packedRgb) {
      const bytesPerPixel = Math.max(3, effectiveBytesPerPixel);
      const stride = bytesPerRow > 0 ? bytesPerRow : Math.max(bytesPerPixel * srcW, 1);
      for (let y = 0; y < height; y++) {
        const syPos = yMap[y];
        for (let x = 0; x < width; x++) {
          const sxPos = xMap[x];
          const srcIdx = syPos * stride + sxPos * bytesPerPixel;
          const dstIdx = (y * width + x) * 3;
          if (srcIdx + 2 < bytes.length) {
            out[dstIdx] = bytes[srcIdx];
            out[dstIdx + 1] = bytes[srcIdx + 1];
            out[dstIdx + 2] = bytes[srcIdx + 2];
          }
        }
      }
    } else {
      const stride = bytesPerRow > 0 ? bytesPerRow : srcW;
      for (let y = 0; y < height; y++) {
        const syPos = yMap[y];
        for (let x = 0; x < width; x++) {
          const sxPos = xMap[x];
          const srcIdx = syPos * stride + sxPos;
          const dstIdx = (y * width + x) * 3;
          if (srcIdx < bytes.length) {
            const luminance = bytes[srcIdx];
            out[dstIdx] = luminance;
            out[dstIdx + 1] = luminance;
            out[dstIdx + 2] = luminance;
          }
        }
      }
    }
  } catch {
    // Worklets don't support console in some environments; swallow errors.
  }

  const outArray = new Array(out.length);
  for (let i = 0; i < out.length; i++) {
    outArray[i] = out[i];
  }
  return outArray;
}
