import {FeatureFlags, isFeatureEnabled} from './featureFlags';

describe('FeatureFlags', () => {
  it('returns the exact configured value for each key', () => {
    const keys = Object.keys(FeatureFlags) as Array<keyof typeof FeatureFlags>;

    for (const key of keys) {
      expect(isFeatureEnabled(key)).toBe(FeatureFlags[key]);
    }
  });

  it('contains known flags required by app flow', () => {
    expect(FeatureFlags).toHaveProperty('banknoteClassifier');
    expect(FeatureFlags).toHaveProperty('onboarding');
    expect(FeatureFlags).toHaveProperty('objectPosition');
  });
});
