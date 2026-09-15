(async () => {
  try {
    const content = window.JournalBackend?.enabled
      ? await window.JournalBackend.request("/api/portfolio")
      : await fetch("/api/portfolio").then(response => response.ok ? response.json() : null);
    if (content) {
      window.PORTFOLIO_CONTENT = content;
      window.dispatchEvent(new Event("portfolio:loaded"));
    }
  } catch {
    // The bundled portfolio remains visible when offline or before migration.
  }
})();
