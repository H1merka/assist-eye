/**
 * Инициализация i18next для локализации (RU / EN).
 *
 * Строки загружаются из JSON-файлов.
 * Язык определяется автоматически из системных настроек
 * или из пользовательских настроек (settingsRepository).
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import en from './locales/en.json';
import ru from './locales/ru.json';

const resources = {
  en: { translation: en },
  ru: { translation: ru },
};

export async function initI18n(): Promise<void> {
  const locales = RNLocalize.getLocales();
  const bestLanguage = locales[0]?.languageCode ?? 'ru';
  const language = ['ru', 'en'].includes(bestLanguage) ? bestLanguage : 'ru';

  await i18n.use(initReactI18next).init({
    resources,
    lng: language,
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18n;
