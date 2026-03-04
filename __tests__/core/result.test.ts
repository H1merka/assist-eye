/**
 * Unit-тесты для Result<T> (discriminated union).
 */

import {success, failure} from '../../src/core/errors/result';
import type {Result} from '../../src/core/errors/result';

describe('Result<T>', () => {
  describe('Success', () => {
    it('создаёт Success с данными', () => {
      const result = success('hello');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toBe('hello');
      }
    });

    it('работает с числами', () => {
      const result = success(42);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toBe(42);
      }
    });

    it('работает с объектами', () => {
      const data = {label: 'bottle', confidence: 0.95};
      const result = success(data);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toEqual(data);
      }
    });
  });

  describe('Failure', () => {
    it('создаёт Failure с кодом и сообщением', () => {
      const result = failure('OCR_NO_TEXT', 'Текст не обнаружен');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.errorCode).toBe('OCR_NO_TEXT');
        expect(result.userMessage).toBe('Текст не обнаружен');
      }
    });
  });

  describe('Pattern matching', () => {
    it('различает Success и Failure через ok', () => {
      const results: Result<string>[] = [
        success('данные'),
        failure('ERR', 'ошибка'),
      ];

      const outputs = results.map(r => (r.ok ? r.data : r.errorCode));
      expect(outputs).toEqual(['данные', 'ERR']);
    });
  });
});
