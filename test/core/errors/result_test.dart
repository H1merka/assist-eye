import 'package:flutter_test/flutter_test.dart';
import 'package:assist_eye/core/errors/result.dart';

/// Тесты для Result<T> — базового типа возврата всех модулей.
void main() {
  group('Result', () {
    group('Success', () {
      test('хранит данные и обеспечивает equality', () {
        // Arrange
        const result1 = Success<String>('hello');
        const result2 = Success<String>('hello');

        // Act & Assert
        expect(result1, equals(result2));
        expect(result1.data, 'hello');
      });

      test('различает разные данные', () {
        // Arrange
        const result1 = Success<String>('hello');
        const result2 = Success<String>('world');

        // Assert
        expect(result1, isNot(equals(result2)));
      });
    });

    group('Failure', () {
      test('хранит код ошибки и сообщение для пользователя', () {
        // Arrange
        const failure = Failure<String>(
          errorCode: 'OCR_NO_TEXT',
          userMessage: 'Текст не обнаружен',
        );

        // Assert
        expect(failure.errorCode, 'OCR_NO_TEXT');
        expect(failure.userMessage, 'Текст не обнаружен');
      });

      test('обеспечивает equality по полям', () {
        // Arrange
        const f1 = Failure<String>(
          errorCode: 'ERR',
          userMessage: 'msg',
        );
        const f2 = Failure<String>(
          errorCode: 'ERR',
          userMessage: 'msg',
        );

        // Assert
        expect(f1, equals(f2));
      });
    });

    test('Success и Failure — разные подтипы (sealed class pattern)', () {
      // Arrange
      const Result<String> success = Success('data');
      const Result<String> failure = Failure(
        errorCode: 'ERR',
        userMessage: 'msg',
      );

      // Assert — проверяем, что switch выражение работает
      final isSuccess = switch (success) {
        Success() => true,
        Failure() => false,
      };
      final isFailure = switch (failure) {
        Success() => false,
        Failure() => true,
      };

      expect(isSuccess, isTrue);
      expect(isFailure, isTrue);
    });
  });
}
