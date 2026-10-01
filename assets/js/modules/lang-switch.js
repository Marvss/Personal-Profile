import { getLocale, onLocaleChange, setLocale } from '../i18n/index.js';

/** Segmented EN | ES control. Buttons declare their locale with data-lang-option. */
export function initLangSwitch(root = document) {
  const buttons = [...root.querySelectorAll('[data-lang-option]')];
  if (!buttons.length) return;

  const sync = (locale) => {
    buttons.forEach((btn) => btn.setAttribute('aria-pressed', String(btn.dataset.langOption === locale)));
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.dataset.langOption !== getLocale()) setLocale(btn.dataset.langOption);
    });
  });

  onLocaleChange(sync);
  sync(getLocale());
}
