import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useFrameProcessor,
} from 'react-native-vision-camera';
import { useRunOnJS, useSharedValue } from 'react-native-worklets-core';
import convertFrameToTensor from '@features/objectDetection/frameProcessor/convertFrameToTensor.worklet';
import { Logger } from '@core/utils/logger';
import {
  FrameTensorTraceContext,
  registerCameraControl,
  registerFrameTensorRequester,
  setCameraPermission,
  setCameraRef,
} from '@features/camera/data/cameraService';

type FrameTensorRequest = {
  id: number;
  width: number;
  height: number;
  trace?: FrameTensorTraceContext;
};

function summarizeTensorValues(tensor: ArrayLike<number>) {
  const length = tensor.length ?? 0;
  if (!length) {
    return { length: 0, nonZeroRatio: 0, sample: [] as number[] };
  }

  const sampleSize = Math.min(12, length);
  const sample = new Array<number>(sampleSize);
  let nonZero = 0;
  for (let i = 0; i < length; i++) {
    const value = Number(tensor[i]);
    if (i < sampleSize) {
      sample[i] = value;
    }
    if (value !== 0) {
      nonZero++;
    }
  }

  return {
    length,
    nonZeroRatio: nonZero / length,
    sample,
  };
}

export function CameraHost(): React.JSX.Element | null {
  const cameraRef = useRef<Camera | null>(null);
  const device = useCameraDevice('back');
  const { hasPermission } = useCameraPermission();
  const [isActive, setIsActive] = useState(false);
  const requestIdRef = useRef(0);
  const pendingRequests = useRef(
    new Map<
      number,
      {
        resolve: (tensor: ArrayLike<number>) => void;
        reject: (error: Error) => void;
        timeoutId: ReturnType<typeof setTimeout>;
      }
    >(),
  );
  const tensorRequest = useSharedValue<FrameTensorRequest | null>(null);

  const handleFrameTensor = useRunOnJS((tensor: ArrayLike<number>, request: FrameTensorRequest) => {
    const pending = pendingRequests.current.get(request.id);
    if (!pending) {
      Logger.warn('CameraHost', 'Frame tensor received without pending request', {
        requestId: request.id,
        sessionId: request.trace?.sessionId ?? 'n/a',
        source: request.trace?.source ?? 'unknown',
      });
      return;
    }

    Logger.info('CameraHost', 'Frame tensor request resolved', {
      requestId: request.id,
      sessionId: request.trace?.sessionId ?? 'n/a',
      source: request.trace?.source ?? 'unknown',
      ...summarizeTensorValues(tensor),
    });

    clearTimeout(pending.timeoutId);
    pending.resolve(tensor);
    pendingRequests.current.delete(request.id);
  }, []);

  const handleFrameTensorDiscard = useRunOnJS((request: FrameTensorRequest, tensorLength: number) => {
    Logger.warn('CameraHost', 'All-zero frame tensor discarded', {
      requestId: request.id,
      sessionId: request.trace?.sessionId ?? 'n/a',
      source: request.trace?.source ?? 'unknown',
      width: request.width,
      height: request.height,
      tensorLength,
    });
  }, []);

  const frameProcessor = useFrameProcessor(
    frame => {
      'worklet';
      const request = tensorRequest.value;
      if (!request) {
        return;
      }

      const tensor = convertFrameToTensor(frame, request.width, request.height);
      let hasNonZeroValue = false;
      for (let i = 0; i < tensor.length; i++) {
        if (tensor[i] !== 0) {
          hasNonZeroValue = true;
          break;
        }
      }

      if (!hasNonZeroValue) {
        handleFrameTensorDiscard(request, tensor.length);
        return;
      }

      tensorRequest.value = null;
      handleFrameTensor(tensor, request);
    },
    [handleFrameTensor, handleFrameTensorDiscard],
  );

  useEffect(() => {
    registerCameraControl({
      setActive: setIsActive,
      notifyReady: () => {
        if (cameraRef.current) {
          setCameraRef(cameraRef as React.RefObject<Camera>);
        }
      },
    });
    registerFrameTensorRequester((width, height, timeoutMs = 2000, trace) => {
      return new Promise<ArrayLike<number>>((resolve, reject) => {
        const id = requestIdRef.current + 1;
        requestIdRef.current = id;
        Logger.info('CameraHost', 'Frame tensor request scheduled', {
          requestId: id,
          sessionId: trace?.sessionId ?? 'n/a',
          source: trace?.source ?? 'unknown',
          width,
          height,
          timeoutMs,
        });

        const timeoutId = setTimeout(() => {
          pendingRequests.current.delete(id);
          tensorRequest.value = null;
          Logger.error('CameraHost', 'Frame tensor request timeout', {
            requestId: id,
            sessionId: trace?.sessionId ?? 'n/a',
            source: trace?.source ?? 'unknown',
            timeoutMs,
          });
          reject(new Error('FrameProcessor timeout'));
        }, timeoutMs);

        pendingRequests.current.set(id, { resolve, reject, timeoutId });
        tensorRequest.value = { id, width, height, trace };
      });
    });
  }, []);

  useEffect(() => {
    setCameraPermission(!!hasPermission);
  }, [hasPermission]);

  useEffect(() => {
    if (isActive && cameraRef.current) {
      setCameraRef(cameraRef as React.RefObject<Camera>);
    }
  }, [isActive]);

  if (!device || !hasPermission || !isActive) {
    return null;
  }

  return (
    <View pointerEvents="none" style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        device={device}
        isActive={isActive}
        photo={true}
        video={true}
        pixelFormat="rgb"
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
});
