import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { PermissionsAndroid } from 'react-native';
import * as Location from 'expo-location';
import { check, request } from 'react-native-permissions';
import { useCameraPermission } from 'react-native-vision-camera';
import { settingsRepository } from '@features/storage/data/databaseHelper';
import { ensureCameraPermission } from '@features/camera/data/cameraPermissions';
import StartupPermissions from '../../components/StartupPermissions';

jest.mock('@features/storage/data/databaseHelper', () => ({
  settingsRepository: {
    getBool: jest.fn(),
    setBool: jest.fn(),
  },
}));

jest.mock('@features/camera/data/cameraPermissions', () => ({
  ensureCameraPermission: jest.fn().mockResolvedValue(true),
}));

describe('StartupPermissions', () => {
  const mockUseCameraPermission = useCameraPermission as jest.Mock;
  const mockCheck = check as jest.Mock;
  const mockRequest = request as jest.Mock;
  const mockLocationGet = Location.getForegroundPermissionsAsync as jest.Mock;
  const mockLocationRequest = Location.requestForegroundPermissionsAsync as jest.Mock;
  const mockGetBool = settingsRepository.getBool as jest.Mock;
  const mockSetBool = settingsRepository.setBool as jest.Mock;
  const mockEnsureCameraPermission = ensureCameraPermission as jest.Mock;
  let permissionsCheckSpy: jest.SpyInstance;
  let permissionsRequestSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockEnsureCameraPermission.mockResolvedValue(true);
    mockGetBool.mockResolvedValue(false);
    mockCheck.mockResolvedValue('denied');
    mockRequest.mockResolvedValue('granted');
    mockLocationGet.mockResolvedValue({ status: 'denied' });
    mockLocationRequest.mockResolvedValue({ status: 'granted' });
    permissionsCheckSpy = jest.spyOn(PermissionsAndroid, 'check').mockResolvedValue(false as never);
    permissionsRequestSpy = jest.spyOn(PermissionsAndroid, 'request').mockResolvedValue('granted' as never);
  });

  afterEach(() => {
    permissionsCheckSpy.mockRestore();
    permissionsRequestSpy.mockRestore();
  });

  it('requests mic, camera, then location in order on first launch', async () => {
    render(<StartupPermissions />);

    await waitFor(() => expect(mockSetBool).toHaveBeenCalledWith('startup_permissions_completed', true));

    expect(mockGetBool).toHaveBeenCalledWith('startup_permissions_completed');
    expect(mockCheck.mock.invocationCallOrder[0]).toBeLessThan(mockRequest.mock.invocationCallOrder[0]);
    expect(mockRequest.mock.invocationCallOrder[0]).toBeLessThan(mockEnsureCameraPermission.mock.invocationCallOrder[0]);
    expect(mockEnsureCameraPermission.mock.invocationCallOrder[0]).toBeLessThan(mockLocationGet.mock.invocationCallOrder[0]);
    expect(mockLocationGet.mock.invocationCallOrder[0]).toBeLessThan(mockLocationRequest.mock.invocationCallOrder[0]);
    expect(mockLocationRequest.mock.invocationCallOrder[0]).toBeLessThan(mockSetBool.mock.invocationCallOrder[0]);
  });

  it('still checks mic and camera when startup permissions were already completed', async () => {
    mockGetBool.mockResolvedValue(true);

    render(<StartupPermissions />);

    await waitFor(() => expect(mockEnsureCameraPermission).toHaveBeenCalled());
    expect(mockCheck).toHaveBeenCalled();
    expect(mockLocationGet).not.toHaveBeenCalled();
    expect(mockSetBool).not.toHaveBeenCalled();
  });
});