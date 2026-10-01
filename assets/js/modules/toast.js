let timer;

/** Shows a short message in the shared live region (#toast). */
export function showToast(message, { duration = 3200 } = {}) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(timer);
  timer = setTimeout(() => toast.classList.remove('is-visible'), duration);
}
