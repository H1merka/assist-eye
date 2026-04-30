import '@testing-library/jest-native/extend-expect';

// Мок для react-native-tts
jest.mock('react-native-tts', () => ({
  speak: jest.fn(),
  stop: jest.fn(),
  setDefaultRate: jest.fn(),
  setDefaultPitch: jest.fn(),
  setDefaultLanguage: jest.fn(),
  voices: jest.fn().mockResolvedValue([]),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

// Мок для react-native-vision-camera
jest.mock('react-native-vision-camera', () => ({
  Camera: 'Camera',
  useCameraDevice: jest.fn(),
  useCameraPermission: jest.fn().mockReturnValue({
    hasPermission: true,
    requestPermission: jest.fn(),
  }),
}));

// Мок для react-native-haptic-feedback
jest.mock('react-native-haptic-feedback', () => ({
  trigger: jest.fn(),
}));

// Мок для react-native-keychain
jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(),
  getGenericPassword: jest.fn(),
  resetGenericPassword: jest.fn(),
}));

// Мок для react-native-sqlite-storage
jest.mock('react-native-sqlite-storage', () => ({
  openDatabase: jest.fn().mockReturnValue({
    transaction: jest.fn(),
    executeSql: jest.fn(),
  }),
}));

// Мок для react-native-fs
jest.mock('react-native-fs', () => ({
  DocumentDirectoryPath: '/tmp',
  MainBundlePath: '/bundle',
  exists: jest.fn().mockResolvedValue(false),
  stat: jest.fn().mockResolvedValue({size: 0}),
  appendFile: jest.fn().mockResolvedValue(undefined),
  unlink: jest.fn().mockResolvedValue(undefined),
  moveFile: jest.fn().mockResolvedValue(undefined),
  readFile: jest.fn().mockResolvedValue(''),
}));
