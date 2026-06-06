export const script = `(function() {
  const scheme = localStorage.getItem('gluestack-ui-color-scheme') || 'system';
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const resolved = scheme === 'dark' || (scheme === 'system' && prefersDark);
  document.documentElement.classList.toggle('dark', resolved);
})();`;
