#!/usr/bin/env python3
"""
Конвертация обученной модели в TFLite с INT8-квантованием (§7.5 ТЗ).

Post-training INT8 квантование для всех моделей — обеспечивает:
- ~4× уменьшение размера модели
- ~2× ускорение inference на мобильных устройствах
- Совместимость с NNAPI (Android) и Core ML (iOS) делегатами

Использование:
    python convert_tflite.py \\
        --saved_model_dir ./output/saved_model \\
        --output_path ./output/model_int8.tflite \\
        --representative_dataset_dir ./data/representative_samples
"""

from __future__ import annotations

import argparse
from pathlib import Path


def parse_args() -> argparse.Namespace:
    """Парсинг аргументов командной строки."""
    parser = argparse.ArgumentParser(
        description="Конвертация модели в TFLite INT8"
    )
    parser.add_argument(
        "--saved_model_dir",
        type=Path,
        required=True,
        help="Путь к SavedModel директории",
    )
    parser.add_argument(
        "--output_path",
        type=Path,
        required=True,
        help="Путь для сохранения .tflite файла",
    )
    parser.add_argument(
        "--representative_dataset_dir",
        type=Path,
        help="Директория с репрезентативными изображениями для калибровки INT8",
    )
    return parser.parse_args()


def main() -> None:
    """Конвертация SavedModel → TFLite INT8."""
    args = parse_args()

    # TODO: Загрузить SavedModel через tf.lite.TFLiteConverter
    # TODO: Настроить INT8-квантование:
    #   converter.optimizations = [tf.lite.Optimize.DEFAULT]
    #   converter.representative_dataset = representative_dataset_gen
    #   converter.target_spec.supported_ops = [tf.lite.OpsSet.TFLITE_BUILTINS_INT8]
    # TODO: Конвертировать и сохранить .tflite файл
    # TODO: Вывести размер файла и проверить корректность invoke
    print(f"[INFO] Вход: {args.saved_model_dir}")
    print(f"[INFO] Выход: {args.output_path}")
    print("[TODO] Реализовать конвертацию")


if __name__ == "__main__":
    main()
