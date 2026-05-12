import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission, useFrameProcessor } from 'react-native-vision-camera';
import { useRunOnJS, useSharedValue } from 'react-native-worklets-core';
import convertFrameToTensor from '@features/objectDetection/frameProcessor/convertFrameToTensor.worklet';
import {
  registerCameraControl,
  registerFrameTensorRequester,
  setCameraPermission,
  setCameraRef,
} from '@features/camera/data/cameraService';

type FrameTensorRequest = {
  id: number;
  width: number;
  height: number;
};

export function CameraHost() {
  const cameraRef = useRef<Camera | null>(null);
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const [isActive, setIsActive] = useState(false);
  const requestIdRef = useRef(0);
  const pendingRequests = useRef(
    new Map<
      number,
      {
        resolve: (tensor: Uint8Array) => void;
        reject: (error: Error) => void;
        timeoutId: ReturnType<typeof setTimeout>;
      }
    >()
  );
  const tensorRequest = useSharedValue<FrameTensorRequest | null>(null);

  const handleFrameTensor = useRunOnJS((tensor: Uint8Array, requestId: number) => {
    const pending = pendingRequests.current.get(requestId);
    if (!pending) return;
    clearTimeout(pending.timeoutId);
    pending.resolve(tensor);
    pendingRequests.current.delete(requestId);
  }, []);

  const frameProcessor = useFrameProcessor(
    (frame) => {
      'worklet';
      const request = tensorRequest.value;
      if (!request) return;
      tensorRequest.value = null;

      const tensor = convertFrameToTensor(frame, request.width, request.height);
      handleFrameTensor(tensor, request.id);
    },
    [handleFrameTensor]
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
    registerFrameTensorRequester((width, height, timeoutMs = 2000) => {
      return new Promise<Uint8Array>((resolve, reject) => {
        const id = requestIdRef.current + 1;
        requestIdRef.current = id;
        const timeoutId = setTimeout(() => {
          pendingRequests.current.delete(id);
          tensorRequest.value = null;
          reject(new Error('FrameProcessor timeout'));
        }, timeoutMs);

        pendingRequests.current.set(id, { resolve, reject, timeoutId });
        tensorRequest.value = { id, width, height };
      });
    });
  }, []);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
    setCameraPermission(!!hasPermission);
  }, [hasPermission, requestPermission]);

  useEffect(() => {
    if (isActive && cameraRef.current) {
      setCameraRef(cameraRef as React.RefObject<Camera>);
    }
  }, [isActive]);

  if (!device) return null;

  return (
    <View pointerEvents="none" style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        device={device}
        isActive={isActive}
        photo={true}
        pixelFormat="rgb"
        frameProcessor={frameProcessor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  camera: {
    flex: 1,
  },
});
