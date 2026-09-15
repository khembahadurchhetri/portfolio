// Decorative parallax: one update per scroll frame, no continuous render loop.
(() => {
  const hero = document.getElementById("hero");
  const layers = [...document.querySelectorAll("[data-depth]")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobile = window.matchMedia("(max-width: 768px)");
  let pointer = 0;
  let scheduled = false;
  function render() {
    scheduled = false;
    const enabled = !reducedMotion.matches;
    const distance = enabled ? Math.min(Math.max(0, -hero.getBoundingClientRect().top), hero.offsetHeight) : 0;
    layers.forEach((layer) => {
      const offset = distance * Number(layer.dataset.depth) * (mobile.matches ? .55 : 1);
      layer.style.setProperty("--layer-y", `${offset.toFixed(2)}px`);
    });
    const ribbon = document.getElementById("scrollRibbon");
    if (ribbon?.parentElement) {
      const bounds = ribbon.parentElement.getBoundingClientRect();
      const height = Math.max(0, window.innerHeight - 64);
      ribbon.style.setProperty("--ribbon-clip-top", `${Math.min(height, Math.max(0, bounds.top - 64))}px`);
      ribbon.style.setProperty("--ribbon-clip-bottom", `${Math.min(height, Math.max(0, window.innerHeight - bounds.bottom))}px`);
      ribbon.style.visibility = bounds.top < window.innerHeight && bounds.bottom > 64 ? "visible" : "hidden";
    }
    const phase = enabled ? window.scrollY / 320 + pointer * 3.2 : 0;
    const amplitude = mobile.matches ? 55 : 70;
    const curve = y => 120 + amplitude * Math.sin(y / 180 + phase);
    const slope = y => amplitude / 180 * Math.cos(y / 180 + phase);
    let path = `M${curve(-200).toFixed(2)} -200`;
    for (let y = -200; y < 1200; y += 100) {
      const end = y + 100;
      path += ` C${(curve(y) + slope(y) * 100 / 3).toFixed(2)} ${(y + 100 / 3).toFixed(2)} ${(curve(end) - slope(end) * 100 / 3).toFixed(2)} ${(end - 100 / 3).toFixed(2)} ${curve(end).toFixed(2)} ${end}`;
    }
    document.getElementById("ribbonCurve")?.setAttribute("d", path);
    const highlight = document.getElementById("ribbonHighlight");
    highlight?.setAttribute("d", path);
    highlight?.setAttribute("stroke-dashoffset", enabled ? String(-window.scrollY * .7) : "0");

  }
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(render);
  }
  window.addEventListener("pointermove", event => {
    if (reducedMotion.matches || event.pointerType === "touch") return;
    pointer = event.clientX / window.innerWidth - .5;
    schedule();
  }, { passive: true });
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
