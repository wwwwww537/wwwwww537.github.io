// src/i18n/utils.ts
import zh from './zh.json';
import en from './en.json';

export const defaultLang = 'zh';

// 组合字典
export const ui = {
  zh,
  en,
} as const;

// 翻译 Hook
export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  }
}