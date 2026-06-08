/** Размеры интерфейса для слабовидящих: крупный текст и зоны нажатия. */
export const LAYOUT = {
  font: {
    title: 38,
    heading: 26,
    body: 24,
    bodySmall: 20,
    caption: 18,
    button: 40,
    control: 36,
    tab: 24,
    settingsSection: 30,
  },
  lineHeight: {
    title: 46,
    heading: 34,
    body: 32,
    bodySmall: 28,
    caption: 26,
  },
  spacing: {
    screen: 28,
    section: 32,
    item: 16,
  },
  touch: {
    min: 56,
    button: 64,
    settings: 76,
  },
  settings: {
    cardPadding: 26,
    langButtonMinHeight: 80,
    speedButton: 80,
    speedDot: 22,
    toggleWidth: 96,
    toggleHeight: 56,
    toggleThumb: 46,
  },
  mainButton: {
    size: 260,
    ring: 80,
  },
  tabBar: {
    height: 112,
    icon: 44,
    itemPaddingVertical: 8,
  },
  radius: {
    card: 18,
    button: 16,
  },
} as const;
