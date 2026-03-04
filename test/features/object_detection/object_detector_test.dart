import 'package:flutter_test/flutter_test.dart';

// TODO: import ObjectDetector, TfliteObjectDetector, DetectionResult, Result

/// Тесты для детектора объектов (§5.1 ТЗ, сценарий «Опиши»).
///
/// Покрываемые случаи:
/// - Детекция известного объекта (COCO-класс)
/// - NMS корректно фильтрует дублирующиеся bounding box
/// - Фильтрация по confidence (≥ 0.45 обычные, ≥ 0.35 safety)
/// - Возврат не более 3 объектов
/// - Пустой результат → Failure с понятным сообщением
void main() {
  group('ObjectDetector', () {
    test('возвращает топ-3 объекта при множественных детекциях', () {
      // TODO: Mock inference → 5 детекций → проверить что вернулось ≤ 3
    });

    test('NMS удаляет перекрывающиеся bounding boxes (IoU > 0.45)', () {
      // TODO: Подать два bbox с IoU > 0.45 → должен остаться один
    });

    test('объекты безопасности используют пониженный порог 0.35', () {
      // TODO: ступенька с confidence 0.38 → должна пройти фильтр
    });

    test('возвращает Failure при отсутствии детекций', () {
      // TODO: Пустой/неинформативный кадр → Failure(DETECTION_NO_OBJECTS, ...)
    });
  });
}
