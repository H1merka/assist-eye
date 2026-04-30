import {failure, success} from '../../src/core/errors/result';

describe('Result smoke', () => {
  it('returns success payload as-is', () => {
    const payload = {value: 42, label: 'ok'};
    const res = success(payload);

    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.data).toEqual(payload);
    }
  });

  it('returns structured failure', () => {
    const res = failure('E_TEST', 'Readable message');

    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.errorCode).toBe('E_TEST');
      expect(res.userMessage).toBe('Readable message');
    }
  });
});
