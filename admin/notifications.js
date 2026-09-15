(() => {
  const toast = document.createElement("div");
  toast.className = "admin-toast"; toast.hidden = true;
  toast.setAttribute("role", "status");
  document.body.append(toast);
  let timer;
  window.adminNotify = text => {
    clearTimeout(timer); toast.textContent = text; toast.hidden = false;
    timer = setTimeout(() => { toast.hidden = true; }, 6500);
  };
  for (const id of ["status", "portfolio-status", "moderation-status"]) {
    const source = document.getElementById(id);
    if (!source) continue;
    let previous = "";
    new MutationObserver(() => {
      const text = source.textContent;
      if (text === previous) return;
      previous = text;
      if (/published|saved|deleted|rejected|uploaded|could not|cannot|failed|signed out/i.test(text) && !/unsaved|click save|changes are saved/i.test(text)) window.adminNotify(text);
    }).observe(source, { childList: true, subtree: true, characterData: true });
  }
})();
