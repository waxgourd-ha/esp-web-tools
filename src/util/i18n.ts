import { fireEvent } from "./fire-event";
import en from "../locales/en.json";
import zhCN from "../locales/zh-CN.json";

export type Language = "en" | "zh-CN";

export interface I18nOptions {
  defaultLanguage?: Language;
  resources?: Record<Language, Record<string, any>>;
}

const languageResources: Record<Language, any> = {
  en,
  "zh-CN": zhCN,
};

class I18nManager {
  private _language: Language;
  private _resources: Record<Language, Record<string, any>> = {
    en: {},
    "zh-CN": {},
  };
  private _loadedLanguages: Set<Language> = new Set();

  constructor(options?: I18nOptions) {
    this._language = options?.defaultLanguage || this._detectLanguage();
    if (options?.resources) {
      this._resources = options.resources;
      Object.keys(options.resources).forEach((lang) => this._loadedLanguages.add(lang as Language));
    }
  }

  private _detectLanguage(): Language {
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get("lang");
    if (langParam && this._isValidLanguage(langParam)) {
      return langParam as Language;
    }
    const savedLang = localStorage.getItem("esp-web-tools-language");
    if (savedLang && this._isValidLanguage(savedLang)) {
      return savedLang as Language;
    }
    const browserLang = navigator.language;
    if (browserLang.startsWith("zh")) {
      return "zh-CN";
    }
    return "en";
  }

  private _isValidLanguage(lang: string): boolean {
    return ["en", "zh-CN"].includes(lang);
  }

  async loadLanguage(language: Language): Promise<void> {
    if (this._loadedLanguages.has(language)) {
      return;
    }
    if (languageResources[language]) {
      this._resources[language] = languageResources[language];
      this._loadedLanguages.add(language);
    } else {
      console.warn(`Language resource not found: ${language}`);
    }
  }

  async setLanguage(language: Language): Promise<void> {
    if (!this._isValidLanguage(language)) {
      console.warn(`Invalid language: ${language}, falling back to English`);
      language = "en";
    }
    await this.loadLanguage(language);
    this._language = language;
    fireEvent(window, "language-changed", { language });
    localStorage.setItem("esp-web-tools-language", language);
  }

  get language(): Language {
    return this._language;
  }

  t(key: string, params?: Record<string, string>): string {
    const keys = key.split(".");
    let value: any = this._resources[this._language];
    for (const k of keys) {
      if (!value || typeof value !== "object") {
        return key;
      }
      value = value[k];
    }
    if (typeof value !== "string") {
      return key;
    }
    if (params) {
      return Object.entries(params).reduce(
        (result, [paramKey, paramValue]) => result.replace(new RegExp(`{{${paramKey}}}`, "g"), paramValue),
        value
      );
    }
    return value;
  }
}

export const i18n = new I18nManager();

const initializeLanguage = async () => {
  await i18n.loadLanguage(i18n.language);
};

initializeLanguage();

declare global {
  interface Window {
    setEspWebToolsLanguage: (language: Language) => Promise<void>;
  }
  interface HTMLElementEventMap {
    "language-changed": CustomEvent<{ language: Language }>;
  }
}

window.setEspWebToolsLanguage = (language: Language) => {
  return i18n.setLanguage(language);
};
