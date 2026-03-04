/**
 * Widget-тест: HomeScreen рендерится без ошибок.
 */

import React from 'react';
import {render} from '@testing-library/react-native';

// Мок навигации
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({navigate: jest.fn()}),
}));

// Мок i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Мок store
jest.mock('../../src/features/commandProcessor/store/commandStore', () => ({
  useCommandProcessor: () => ({
    state: 'idle',
    lastResult: null,
    errorMessage: null,
  }),
}));

import {HomeScreen} from '../../src/ui/screens/HomeScreen';

describe('HomeScreen', () => {
  it('рендерится без ошибок', () => {
    const {getByText} = render(<HomeScreen />);
    // Используем ключ из мока t()
    expect(getByText('home.voiceButton')).toBeTruthy();
    expect(getByText('home.settings')).toBeTruthy();
    expect(getByText('home.history')).toBeTruthy();
  });
});
