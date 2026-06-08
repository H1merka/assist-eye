export function softmax(values: ArrayLike<number>): Float32Array {
  const array = Float32Array.from(values as ArrayLike<number>);
  if (array.length === 0) {
    return array;
  }

  let max = array[0];
  for (let i = 1; i < array.length; i++) {
    if (array[i] > max) {
      max = array[i];
    }
  }

  const exps = new Float32Array(array.length);
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    const value = Math.exp(array[i] - max);
    exps[i] = value;
    sum += value;
  }

  if (sum <= 0) {
    return exps;
  }

  for (let i = 0; i < exps.length; i++) {
    exps[i] /= sum;
  }
  return exps;
}

export function argmax(values: ArrayLike<number>): { index: number; value: number } {
  const array = Float32Array.from(values as ArrayLike<number>);
  let index = 0;
  let value = array[0] ?? 0;
  for (let i = 1; i < array.length; i++) {
    if (array[i] > value) {
      value = array[i];
      index = i;
    }
  }
  return { index, value };
}

export function formatBanknoteLabel(label: string): string {
  const trimmed = label.trim();
  if (/^\d+$/.test(trimmed)) {
    return `${trimmed} рублей`;
  }
  return trimmed;
}
