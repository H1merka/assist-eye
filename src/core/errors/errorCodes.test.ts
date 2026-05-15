import * as codes from './errorCodes';

describe('errorCodes', () => {
  it('exports non-empty string constants', () => {
    const values = Object.values(codes);

    expect(values.length).toBeGreaterThan(0);
    values.forEach(value => {
      expect(typeof value).toBe('string');
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('has unique values to avoid ambiguous handling', () => {
    const values = Object.values(codes);
    const unique = new Set(values);

    expect(unique.size).toBe(values.length);
  });
});
