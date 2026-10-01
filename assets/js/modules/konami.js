import { t } from '../i18n/index.js';
import { showToast } from './toast.js';

const SEQUENCE = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];

/** ↑ ↑ ↓ ↓ ← → ← → B A — a small reward for the curious. */
export function initKonami() {
  let position = 0;

  document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (key === SEQUENCE[position]) position += 1;
    // On a miss, an extra "up" still counts as progress (↑ ↑ ↑ ↓ … works).
    else if (key === SEQUENCE[0]) position = position === 2 ? 2 : 1;
    else position = 0;
    if (position < SEQUENCE.length) return;

    position = 0;
    const root = document.documentElement;
    root.classList.remove('cheat-mode');
    void root.offsetWidth; // restart the animation if triggered twice
    root.classList.add('cheat-mode');
    showToast(t('toast.konami'), { duration: 5000 });
  });
}
