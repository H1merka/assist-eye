import {failure, success} from './result';

describe('Result factories', () => {
  it('creates success result', () => {
    const result = success('ok');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toBe('ok');
    }
  });

  it('creates failure result', () => {
    const result = failure('E_CODE', 'Readable message');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errorCode).toBe('E_CODE');
      expect(result.userMessage).toBe('Readable message');
    }
  });
});
