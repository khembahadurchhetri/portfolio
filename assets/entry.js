(async () => {
  const target = document.querySelector("#entry");
  try {
    let posts;
    if (window.JournalBackend?.enabled) {
      posts = await window.JournalBackend.request(
        "/api/posts/" +
          encodeURIComponent(
            new URLSearchParams(location.search).get("id") || "",
          ),
      );
    } else {
      let response = await fetch("/api/posts");
      if (
        !response.ok ||
        !response.headers.get("content-type")?.includes("application/json")
      )
        response = await fetch("/assets/journal-samples.json");
      if (!response.ok) throw new Error();
      posts = await response.json();
    }
    const entry = posts.find(
      (p) => p.id === new URLSearchParams(location.search).get("id"),
    );
    if (!entry) {
      target.textContent = "This entry is unavailable or private.";
      return;
    }
    target.replaceChildren();
    document.title = entry.title + " · Journal";
    const label = document.createElement("p");
    label.className = "eyebrow";
    label.textContent =
      entry.category + (entry.sample ? " · Sample content" : "");
    const title = document.createElement("h1");
    title.textContent = entry.title;
    const body = document.createElement("p");
    body.className = "entry-body";
    body.textContent = entry.text;
    target.append(label, title, body);
    if (entry.author_name) {
      const by = document.createElement("p");
      by.className = "journal-author";
      const name = document.createElement("strong");
      name.textContent = entry.author_name;
      by.append("By ", name);
      target.insertBefore(by, body);
    }
    if (entry.image) {
      const mediaUrl = window.JournalBackend?.enabled
        ? await window.JournalBackend.media(entry.image)
        : entry.image;
      const media = document.createElement(
        /\.(mp4|webm)$/i.test(entry.image) ? "video" : "img",
      );
      {
        media.className = "entry-media";
        media.src = mediaUrl;
        if (media.tagName === "VIDEO") media.controls = true;
        else
          media.alt = entry.sample
            ? "AI-generated sample landscape"
            : entry.title;
        target.append(media);
      }
    }
    if (entry.url && /^https?:\/\//i.test(entry.url)) {
      const link = document.createElement("a");
      link.href = entry.url;
      link.textContent = "Related link ↗";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      target.append(link);
    }
  } catch {
    target.textContent = "Unable to load this entry. Please try again later.";
  }
})();
