export enum Language {
  ENGLISH = 'en',
  CHINESE = 'zh',
}

export const LANGUAGE_NAMES = {
  [Language.ENGLISH]: 'English',
  [Language.CHINESE]: 'Chinese',
} as const;
