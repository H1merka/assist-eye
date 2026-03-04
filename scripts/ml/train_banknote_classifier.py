#!/usr/bin/env python3
"""
Скрипт обучения классификатора денежных купюр (§4.7, §7.5 ТЗ).

Модель: MobileNet v3-Small, fine-tuned.
Купюры:
  - Российские рубли: 50, 100, 200, 500, 1000, 2000, 5000
  - Доллары США: 1, 5, 10, 20, 50, 100

Датасет: Open Images + собственная выборка ≥ 200 фото/номинал.
Среда: Google Colab (бесплатный GPU-tier).

Использование:
    python train_banknote_classifier.py \\
        --data_dir ./data/banknotes \\
        --output_dir ./output \\
        --epochs 50 \\
        --batch_size 32
"""

from __future__ import annotations

import argparse
from pathlib import Path


def parse_args() -> argparse.Namespace:
    """Парсинг аргументов командной строки."""
    parser = argparse.ArgumentParser(
        description="Обучение классификатора денежных купюр (MobileNet v3-Small)"
    )
    parser.add_argument(
        "--data_dir",
        type=Path,
        required=True,
        help="Путь к директории с датасетом (подпапки = классы)",
    )
    parser.add_argument(
        "--output_dir",
        type=Path,
        default=Path("./output"),
        help="Директория для сохранения обученной модели",
    )
    parser.add_argument("--epochs", type=int, default=50, help="Количество эпох")
    parser.add_argument("--batch_size", type=int, default=32, help="Размер батча")
    parser.add_argument(
        "--learning_rate", type=float, default=1e-3, help="Learning rate"
    )
    parser.add_argument(
        "--image_size", type=int, default=224, help="Размер входного изображения"
    )
    return parser.parse_args()


def main() -> None:
    """Основной pipeline обучения."""
    args = parse_args()

    # TODO: Загрузить и аугментировать датасет
    # TODO: Создать модель MobileNet v3-Small с предобученными весами ImageNet
    # TODO: Заморозить базовые слои, заменить head на свой classifier
    # TODO: Обучить с callbacks: EarlyStopping, ReduceLROnPlateau
    # TODO: Оценить accuracy на валидационном наборе
    # TODO: Сохранить модель в SavedModel формате
    print(f"[INFO] Датасет: {args.data_dir}")
    print(f"[INFO] Выход: {args.output_dir}")
    print(f"[INFO] Эпох: {args.epochs}, batch: {args.batch_size}")
    print("[TODO] Реализовать pipeline обучения")


if __name__ == "__main__":
    main()
