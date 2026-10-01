import { t } from '../i18n/index.js';
import { showToast } from './toast.js';

/** Buttons with data-copy="text" copy that text to the clipboard. */
export function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        showToast(t('toast.copied'));
      } catch {
        showToast(t('toast.copyFailed'), { duration: 6000 });
      }
    });
  });
}
