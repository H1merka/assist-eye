// Worklet to convert a camera frame to an RGB tensor suitable for TFLite.
// This file is executed on the frame-processor worklet thread (JSI).
// It intentionally uses minimal runtime features and must be kept plain.

// @ts-ignore
export default function convertFrameToTensor(frame: any, width: number, height: number) {
  'worklet';
  // Frame shape: frame.width, frame.height, frame.bytes (Uint8Array) or frame.getBytes()
  // The exact API depends on the camera/frame-processor implementation; adapt as needed.

  const srcW = frame.width || 0;
  const srcH = frame.height || 0;

  // If frame provides raw bytes in RGBA order, reuse them; otherwise, attempt simple fallback.
  // We'll output an Uint8Array of length width*height*3 (RGB).
  const out = new Uint8Array(width * height * 3);

  try {
    // If the frame exposes `.bytes` as RGBA, downscale/copy center crop naive approach.
    // Note: Proper resizing must be implemented natively for speed/quality.
    const bytes = frame.bytes || frame.data || null;
    if (bytes && bytes.length >= srcW * srcH * 4) {
      // Naive nearest-neighbor center crop + downscale by sampling.
      const sx = Math.floor((srcW - width) / 2);
      const sy = Math.floor((srcH - height) / 2);
      for (let y = 0; y < height; y++) {
        const syPos = sy + Math.floor((y * srcH) / height);
        for (let x = 0; x < width; x++) {
          const sxPos = sx + Math.floor((x * srcW) / width);
          const srcIdx = (syPos * srcW + sxPos) * 4;
          const dstIdx = (y * width + x) * 3;
          out[dstIdx] = bytes[srcIdx]; // R
          out[dstIdx + 1] = bytes[srcIdx + 1]; // G
          out[dstIdx + 2] = bytes[srcIdx + 2]; // B
        }
      }
    } else {
      // No raw bytes — return zero-filled buffer
      // Keep out as zeros
    }
  } catch (e) {
    // Worklets don't support console in some environments; swallow errors.
  }

  return out;
}
