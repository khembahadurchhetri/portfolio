(() => {
  const filters = document.querySelector(".journal-filters"),
    grid = document.querySelector(".journal-grid");
  if (!filters || !grid) return;

  // ===== Filter strip: wheel + mouse-drag + native touch scrolling =====
  filters.addEventListener("wheel", (event) => {
    if (event.ctrlKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
    const before = filters.scrollLeft;
    const scale = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? filters.clientWidth : 1;
    filters.scrollLeft += event.deltaY * scale;
    if (filters.scrollLeft !== before) event.preventDefault();
  }, { passive: false });

  let drag = null, dragged = false;
  filters.addEventListener("pointerdown", event => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    dragged = false;
    drag = { x: event.clientX, left: filters.scrollLeft, id: event.pointerId };
  });
  filters.addEventListener("pointermove", event => {
    if (!drag) return;
    const distance = event.clientX - drag.x;
    if (!dragged && Math.abs(distance) < 5) return;
    dragged = true;
    filters.setPointerCapture(event.pointerId);
    filters.scrollLeft = drag.left - distance;
    event.preventDefault();
  });
  filters.addEventListener("pointerup", () => { drag = null; });
  filters.addEventListener("pointerleave", () => { if (!dragged) drag = null; });
  filters.addEventListener("pointercancel", () => { drag = null; dragged = false; });
  filters.addEventListener("lostpointercapture", () => { drag = null; });
  filters.addEventListener("click", event => {
    if (!dragged) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    dragged = false;
  }, true);

  let entries = [],
    category = "All";

  function changeCategory(direction) {
    const buttons = [...filters.querySelectorAll("button")];
    const index = buttons.findIndex(button => button.textContent === category);
    const target = buttons[index + direction];
    if (!target) return;
    category = target.textContent;
    render();
    // Reveal the selected tab without scrolling the page vertically.
    if (target.offsetLeft < filters.scrollLeft) filters.scrollLeft = target.offsetLeft;
    else if (target.offsetLeft + target.offsetWidth > filters.scrollLeft + filters.clientWidth)
      filters.scrollLeft = target.offsetLeft + target.offsetWidth - filters.clientWidth;
  }

  // Card text, links and empty space share the same swipe gesture.
  let swipe = null, suppressClick = false;
  grid.addEventListener("pointerdown", event => {
    if (event.isPrimary === false) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    suppressClick = false;
    swipe = { x: event.clientX, y: event.clientY, horizontal: false };
  });
  grid.addEventListener("pointermove", event => {
    if (!swipe) return;
    const dx = event.clientX - swipe.x, dy = event.clientY - swipe.y;
    if (!swipe.horizontal && Math.abs(dy) > 12 && Math.abs(dy) >= Math.abs(dx)) { swipe = null; return; }
    if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      swipe.horizontal = true;
      grid.setPointerCapture(event.pointerId);
      event.preventDefault();
    }
  });
  grid.addEventListener("pointerup", event => {
    if (!swipe) return;
    const dx = event.clientX - swipe.x;
    suppressClick = swipe.horizontal;
    if (swipe.horizontal && Math.abs(dx) >= 50) changeCategory(dx < 0 ? 1 : -1);
    swipe = null;
  });
  grid.addEventListener("pointercancel", () => { swipe = null; suppressClick = false; });
  grid.addEventListener("lostpointercapture", () => { swipe = null; });
  grid.addEventListener("pointerleave", () => { if (!swipe?.horizontal) swipe = null; });
  grid.addEventListener("click", event => {
    if (!suppressClick) return;
    event.preventDefault(); event.stopImmediatePropagation(); suppressClick = false;
  }, true);
  grid.addEventListener("dragstart", event => event.preventDefault());

  let lastWheel = -Infinity, wheelDistance = 0, wheelChanged = false;
  grid.addEventListener("wheel", event => {
    if (event.ctrlKey || Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
    event.preventDefault();
    if (event.timeStamp - lastWheel > 200) { wheelDistance = 0; wheelChanged = false; }
    lastWheel = event.timeStamp;
    if (wheelChanged) return;
    wheelDistance += event.deltaX * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? grid.clientWidth : 1);
    if (Math.abs(wheelDistance) >= 50) {
      changeCategory(wheelDistance > 0 ? 1 : -1);
      wheelChanged = true;
    }
  }, { passive: false });

  grid.addEventListener("keydown", event => {
    if (event.target !== grid || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    changeCategory(event.key === "ArrowRight" ? 1 : -1);
  });

  function render() {
    const selected = entries.filter(
      (entry) => category === "All" || entry.category === category,
    );
    grid.replaceChildren();
    grid.scrollTop = 0;
    filters
      .querySelectorAll("button")
      .forEach((button) =>
        button.setAttribute(
          "aria-pressed",
          String(button.textContent === category),
        ),
      );
    const fragment = document.createDocumentFragment();
    for (const entry of selected) {
      const card = document.createElement("article");
      card.className = "journal-card";
      const label = document.createElement("span");
      label.className = "section-kicker";
      label.textContent = entry.category + (entry.sample ? " · Sample" : "");
      const title = document.createElement("h3");
      title.textContent = entry.title;
      const text = document.createElement("p");
      text.textContent = entry.text;
      const read = document.createElement("a");
      read.href = "/entry.html?id=" + encodeURIComponent(entry.id);
      read.textContent = "open →";
      card.append(label, title, text);
      if (entry.author_name) {
        const by = document.createElement("small");
        by.className = "journal-author";
        const name = document.createElement("strong");
        name.textContent = entry.author_name;
        by.append("Shared by ", name);
        card.append(by);
      }
      card.append(read);
      fragment.append(card);
    }
    grid.append(fragment);
    if (!selected.length) grid.textContent = "No entries here yet.";
  }

  async function load() {
    try {
      if (window.JournalBackend?.enabled) {
        entries = await window.JournalBackend.request("/api/posts");
      } else {
        const response = await fetch("/api/posts");
        if (
          !response.ok ||
          !response.headers.get("content-type")?.includes("application/json")
        )
          throw new Error();
        entries = await response.json();
      }
    } catch {
      if (window.JournalBackend?.enabled) {
        grid.textContent =
          "The journal is being connected. Please check back shortly.";
        return;
      }
      try {
        const response = await fetch("/assets/journal-samples.json");
        if (!response.ok) throw new Error();
        entries = await response.json();
        document.querySelector("#journal-mode").textContent = "Sample preview";
      } catch {
        grid.textContent =
          "Start the site with npm start to browse the journal.";
        return;
      }
    }
    const fragment = document.createDocumentFragment();
    for (const name of [
      "All",
      ...new Set([
        "Books",
        "Movies",
        "Notes",
        "Photos & videos",
        "Vlogs",
        "Quotes",
        "News",
        ...entries.map((entry) => entry.category),
      ]),
    ]) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = name;
      button.addEventListener("click", () => {
        category = name;
        render();
      });
      fragment.append(button);
    }
    filters.append(fragment);
    render();
  }

  if (typeof IntersectionObserver === "function") {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          load();
        }
      },
      { rootMargin: "500px" },
    );
    observer.observe(grid);
  } else load();
})();
