/**
 * Тесты доступности (accessibility).
 *
 * Проверяют наличие accessibilityLabel на интерактивных элементах
 * и соблюдение минимальных размеров touch-target (48×48 dp).
 *
 * Запуск: npm run test:accessibility
 */

import React from 'react';
import {render} from '@testing-library/react-native';
import {AccessibleButton} from '../../src/ui/components/AccessibleButton';

describe('Accessibility', () => {
  describe('AccessibleButton', () => {
    it('имеет accessibilityRole="button"', () => {
      const {getByRole} = render(
        <AccessibleButton
          label="Тест"
          accessibilityLabel="Тестовая кнопка"
          onPress={jest.fn()}
        />,
      );

      const button = getByRole('button');
      expect(button).toBeTruthy();
    });

    it('имеет accessibilityLabel', () => {
      const {getByLabelText} = render(
        <AccessibleButton
          label="Тест"
          accessibilityLabel="Тестовая кнопка"
          onPress={jest.fn()}
        />,
      );

      expect(getByLabelText('Тестовая кнопка')).toBeTruthy();
    });

    it('передаёт accessibilityHint', () => {
      const {getByA11yHint} = render(
        <AccessibleButton
          label="Тест"
          accessibilityLabel="Кнопка"
          accessibilityHint="Нажмите для действия"
          onPress={jest.fn()}
        />,
      );

      expect(getByA11yHint('Нажмите для действия')).toBeTruthy();
    });

    it('отражает disabled в accessibilityState', () => {
      const {getByRole} = render(
        <AccessibleButton
          label="Тест"
          accessibilityLabel="Кнопка"
          onPress={jest.fn()}
          disabled
        />,
      );

      const button = getByRole('button');
      expect(button.props.accessibilityState).toEqual({disabled: true});
    });

    // TODO: Тест на минимальный размер 48×48:
    // После рендера — проверить layout через onLayout или snapshot.
    // В unit-тестах стили проверяем через snapshot; реальные размеры — через E2E.
  });
});
