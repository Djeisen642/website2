// https://www.hanselman.com/blog/how-to-detect-if-the-users-os-prefers-dark-mode-and-change-your-site-with-css-and-js
let callback = () => {};
let match: MediaQueryList;
if (window.matchMedia) {
  match = window.matchMedia('(prefers-color-scheme: dark)');
}
export function setupWatchForSystemPreference(toggleDarkModeCallback: (isDark: boolean) => void) {
  if (!match) return;

  callback = () => {
    toggleDarkModeCallback(match.matches);
  };
  match.addEventListener('change', callback);
}

export function disableWatchForSystemPreference() {
  if (!match) return;

  match.removeEventListener('change', callback);
}

export function isDarkSystemPreference() {
  if (!match) return false;
  return match;
}
