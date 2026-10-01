import { initI18n } from './i18n/index.js';
import { initLangSwitch } from './modules/lang-switch.js';
import { initNav } from './modules/nav.js';
import { initReveal } from './modules/reveal.js';
import { initCopyButtons } from './modules/copy-email.js';
import { initKonami } from './modules/konami.js';

initI18n();
initLangSwitch();
initNav();
initReveal();
initCopyButtons();
initKonami();

document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = String(new Date().getFullYear());
});

console.log(
  '%c> PLAYER 2 HAS ENTERED THE GAME',
  'font: 12px monospace; color: #3ddc84; background: #0a0c10; padding: 6px 10px;',
  '\nReading the source? Nice. Let\'s talk: olamarvin40@gmail.com',
);
