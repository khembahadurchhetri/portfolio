(() => {
  const filters = document.querySelector(".journal-filters"),
    grid = document.querySelector(".journal-grid");
  if (!filters || !grid) return;
  let entries = [],
    category = "All";
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
      grid.append(card);
    }
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
      filters.append(button);
    }
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
