import en from './locales/en.js';
import es from './locales/es.js';

const LOCALES = { en, es };
export const SUPPORTED_LOCALES = Object.keys(LOCALES);
export const DEFAULT_LOCALE = 'en';

// Keep in sync with the inline anti-flash script in index.html.
const STORAGE_KEY = 'mo.lang';

let current = DEFAULT_LOCALE;
const listeners = new Set();

const normalize = (value) => value?.toLowerCase().split('-')[0];

function readStored() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function persist(locale) {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    /* storage blocked: the choice simply won't survive a reload */
  }
}

/** Translate a key, falling back to the default locale and then the key itself. */
export function t(key, locale = current) {
  return LOCALES[locale]?.[key] ?? LOCALES[DEFAULT_LOCALE][key] ?? key;
}

export const getLocale = () => current;

/** Priority: ?lang= in the URL > saved choice > browser languages > default. */
export function resolveInitialLocale() {
  const fromUrl = new URLSearchParams(window.location.search).get('lang');
  const browser = navigator.languages?.length ? navigator.languages : [navigator.language];
  const match = [fromUrl, readStored(), ...browser].map(normalize).find((l) => SUPPORTED_LOCALES.includes(l));
  return match ?? DEFAULT_LOCALE;
}

/**
 * Elements opt in with:
 *   data-i18n="key"                         -> textContent
 *   data-i18n-attr="aria-label:key;title:k" -> attributes
 */
function render(locale, root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n, locale);
  });

  root.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    el.dataset.i18nAttr.split(';').forEach((pair) => {
      const [attr, key] = pair.split(':').map((part) => part.trim());
      if (attr && key) el.setAttribute(attr, t(key, locale));
    });
  });

  document.documentElement.lang = locale;
  document.title = t('meta.title', locale);
}

function syncUrl(locale) {
  const url = new URL(window.location.href);
  if (locale === DEFAULT_LOCALE) url.searchParams.delete('lang');
  else url.searchParams.set('lang', locale);
  window.history.replaceState(window.history.state, '', url);
}

export function setLocale(locale, { save = true } = {}) {
  const next = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
  current = next;
  render(next);
  if (save) {
    persist(next);
    syncUrl(next);
  }
  document.documentElement.classList.remove('i18n-pending');
  listeners.forEach((fn) => fn(next));
}

export function onLocaleChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function initI18n() {
  // Don't persist the auto-detected locale: only an explicit click should.
  setLocale(resolveInitialLocale(), { save: false });
}
