// Worklet to convert a camera frame to an RGB tensor suitable for TFLite.
// This file is executed on the frame-processor worklet thread (JSI).
// It intentionally uses minimal runtime features and must be kept plain.

// @ts-ignore
export default function convertFrameToTensor(frame: any, width: number, height: number) {
  'worklet';
  // Frame shape: frame.width, frame.height, frame.toArrayBuffer()
  // The exact API depends on the camera/frame-processor implementation; adapt as needed.

  const srcW = frame.width || 0;
  const srcH = frame.height || 0;

  // Output is Uint8Array of length width*height*3 (RGB).
  const out = new Uint8Array(width * height * 3);
  if (!srcW || !srcH) {
    const outArray = new Array(out.length);
    for (let i = 0; i < out.length; i++) {
      outArray[i] = out[i];
    }
    return outArray;
  }

  try {
    let bytes: Uint8Array | null = null;
    if (typeof frame.toArrayBuffer === 'function') {
      const buffer = frame.toArrayBuffer();
      if (buffer) {
        bytes = new Uint8Array(buffer);
      }
    } else if (frame?.bytes) {
      if (frame.bytes instanceof Uint8Array) {
        bytes = frame.bytes;
      } else if (frame.bytes instanceof ArrayBuffer) {
        bytes = new Uint8Array(frame.bytes);
      } else if (ArrayBuffer.isView(frame.bytes)) {
        const view = frame.bytes as ArrayBufferView;
        bytes = new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
      }
    } else if (frame?.data) {
      if (frame.data instanceof Uint8Array) {
        bytes = frame.data;
      } else if (frame.data instanceof ArrayBuffer) {
        bytes = new Uint8Array(frame.data);
      } else if (ArrayBuffer.isView(frame.data)) {
        const view = frame.data as ArrayBufferView;
        bytes = new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
      }
    }

    if (!bytes) {
      const outArray = new Array(out.length);
      for (let i = 0; i < out.length; i++) {
        outArray[i] = out[i];
      }
      return outArray;
    }

    const pixelCount = srcW * srcH;
    const bytesPerPixel = Math.floor(bytes.length / pixelCount);
    if (bytesPerPixel < 3) {
      const outArray = new Array(out.length);
      for (let i = 0; i < out.length; i++) {
        outArray[i] = out[i];
      }
      return outArray;
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

    for (let y = 0; y < height; y++) {
      const syPos = yMap[y];
      for (let x = 0; x < width; x++) {
        const sxPos = xMap[x];
        const srcIdx = (syPos * srcW + sxPos) * bytesPerPixel;
        const dstIdx = (y * width + x) * 3;
        out[dstIdx] = bytes[srcIdx];
        out[dstIdx + 1] = bytes[srcIdx + 1];
        out[dstIdx + 2] = bytes[srcIdx + 2];
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
