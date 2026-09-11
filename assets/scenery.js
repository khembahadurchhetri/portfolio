// Decorative parallax: one update per scroll frame, no continuous render loop.
(() => {
  const hero = document.getElementById("hero");
  const layers = [...document.querySelectorAll("[data-depth]")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobile = window.matchMedia("(max-width: 768px)");
  let scheduled = false;
  function render() {
    scheduled = false;
    const enabled = !reducedMotion.matches;
    const distance = enabled ? Math.min(Math.max(0, -hero.getBoundingClientRect().top), hero.offsetHeight) : 0;
    layers.forEach((layer) => {
      const offset = distance * Number(layer.dataset.depth) * (mobile.matches ? .55 : 1);
      layer.style.setProperty("--layer-y", `${offset.toFixed(2)}px`);
    });
  }
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(render);
  }
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  document.addEventListener("appearancechange", schedule);
  reducedMotion.addEventListener("change", schedule);
  render();
})();

// Keep both navigation menus in sync with the section beneath the header.
(() => {
  const nav = document.querySelector("nav");
  const links = [...document.querySelectorAll('.nav-links a[href^="#"], .mobile-menu a[href^="#"]')];
  const sections = [...new Set(links.map((link) => document.getElementById(link.hash.slice(1))))].filter(Boolean);
  let scheduled = false;
  let activeId = null;
  function update() {
    scheduled = false;
    const marker = nav.getBoundingClientRect().bottom + Math.min(120, window.innerHeight * .18);
    let current = "";
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= marker) current = section.id;
    });
    if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      current = sections.at(-1)?.id || current;
    }
    if (current === activeId) return;
    activeId = current;
    links.forEach((link) => {
      if (link.hash === `#${current}`) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(update);
  }
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  window.addEventListener("pageshow", schedule);
  window.addEventListener("load", schedule);
  document.fonts?.ready.then(schedule);
  update();
})();
