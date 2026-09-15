(() => {
  const root = document.querySelector("#portfolio-editor");
  if (!root) return;
  const notice = document.querySelector("#portfolio-status");
  let content, changed = false, pending = false;
  const tell = text => { notice.textContent = text; };
  const mark = () => { changed = true; tell("Unsaved portfolio changes."); };
  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function field(parent, label, object, key, { multiline = false, required = false } = {}) {
    const wrapper = element("label", label);
    const input = element(multiline ? "textarea" : "input");
    input.value = Array.isArray(object[key]) ? object[key].join(", ") : object[key] || "";
    input.required = required;
    input.maxLength = multiline ? 1500 : 2000;
    if (multiline) input.rows = 3;
    input.addEventListener("input", () => { object[key] = key === "stack" ? input.value.split(",").map(tag => tag.trim()).filter(Boolean) : input.value; mark(); });
    wrapper.append(input); parent.append(wrapper);
    return input;
  }
  function upload(parent, label, object, key, accept) {
    const wrapper = element("label", label);
    const input = element("input"); input.type = "file"; input.accept = accept;
    input.addEventListener("change", async () => {
      const file = input.files[0]; if (!file) return;
      if (!accept.split(",").includes(file.type) || file.size > 10 * 1024 * 1024) { tell("Choose an allowed file smaller than 10 MB."); input.value = ""; return; }
      pending = true; root.querySelector("fieldset").disabled = true;
      tell("Uploading portfolio file…");
      try {
        const result = await api("/api/admin/portfolio-media", { method: "POST", body: file });
        object[key] = result.url; mark(); render(); tell("Uploaded. Save portfolio to update the website.");
      } catch (error) { tell(error.message); }
      finally { pending = false; root.querySelector("fieldset").disabled = false; input.value = ""; }
    });
    wrapper.append(input); parent.append(wrapper);
  }
  function validUrl(value, optional = false) {
    return (optional && !value) || (typeof value === "string" && (/^https:\/\/[^\s]+$/i.test(value) || /^\/(?!\/)[\w/.-]+$/.test(value)));
  }
  function render() {
    root.replaceChildren();
    const form = element("form"), fields = element("fieldset");
    fields.className = "portfolio-fields";
    form.append(fields);
    field(fields, "Profile photo URL", content, "photo", { required: true });
    upload(fields, "Replace profile photo (up to 10 MB)", content, "photo", "image/png,image/jpeg,image/webp");
    if (validUrl(content.photo)) { const preview = element("img"); preview.src = content.photo; preview.alt = "Profile photo preview"; preview.className = "portfolio-photo-preview"; fields.append(preview); }
    field(fields, "CV PDF URL", content, "cv", { required: true });
    upload(fields, "Replace CV (PDF, up to 10 MB)", content, "cv", "application/pdf");
    if (validUrl(content.cv)) { const preview = element("a", "Preview current CV ?"); preview.href = content.cv; preview.target = "_blank"; preview.rel = "noopener"; fields.append(preview); }
    fields.append(element("h3", "Projects"));
    content.projects.forEach((project, index) => {
      const details = element("details"), summary = element("summary", project.title || "New project");
      details.className = "portfolio-project-editor"; details.append(summary);
      field(details, "Project title", project, "title", { required: true });
      field(details, "Description", project, "description", { multiline: true });
      field(details, "Category / badge", project, "badge");
      field(details, "Technologies (comma separated)", project, "stack");
      field(details, "Live URL (optional)", project, "liveUrl");
      field(details, "GitHub / code URL", project, "codeUrl", { required: true });
      field(details, "Project image URL (optional)", project, "image");
      upload(details, "Upload project image (up to 10 MB)", project, "image", "image/png,image/jpeg,image/webp");
      const remove = element("button", "Remove project", "danger"); remove.type = "button";
      remove.addEventListener("click", () => { if (!confirm(`Remove ${project.title || "this project"}? Save portfolio to publish the removal.`)) return; content.projects.splice(index, 1); mark(); render(); });
      details.append(remove); fields.append(details);
    });
    const add = element("button", "+ Add project"); add.type = "button"; add.disabled = content.projects.length >= 40;
    add.addEventListener("click", () => { content.projects.push({ id: crypto.randomUUID(), title: "New project", description: "", badge: "", stack: [], image: "", liveUrl: "", codeUrl: "https://github.com/khembahadurchhetri" }); mark(); render(); const last = root.querySelector("details:last-of-type"); last.open = true; last.querySelector("input").focus(); });
    const save = element("button", "Save portfolio", "primary"); save.type = "submit";
    const actions = element("div", "", "actions"); actions.append(add, save); fields.append(actions);
    form.addEventListener("submit", async event => {
      event.preventDefault(); if (pending) return;
      if (!validUrl(content.photo) || !validUrl(content.cv) || content.projects.some(p => !p.title.trim() || !validUrl(p.codeUrl) || !validUrl(p.liveUrl, true) || !validUrl(p.image, true))) { tell("Use HTTPS URLs or local /paths for your photo, CV and project links. Every project needs a title and code link."); return; }
      pending = true; fields.disabled = true; tell("Saving portfolio…");
      try {
        await api("/api/admin/portfolio", { method: "PUT", body: JSON.stringify(content) });
        changed = false; tell("Portfolio saved. Your website now uses these projects, photo and CV.");
      } catch (error) { tell(error.message); }
      finally { pending = false; fields.disabled = false; }
    });
    root.append(form);
  }
  async function load() {
    if (changed || pending) return;
    tell("Loading portfolio settings…");
    try {
      content = await api("/api/admin/portfolio");
      if (!content) { const response = await fetch("/assets/portfolio-defaults.json"); if (!response.ok) throw new Error("Could not load portfolio defaults."); content = await response.json(); }
      render(); tell("Changes appear on the website after you save portfolio.");
    } catch (error) { tell(error.message); }
  }
  window.addEventListener("portfolio:owner", load);
  window.addEventListener("beforeunload", event => { if (changed || pending) { event.preventDefault(); event.returnValue = ""; } });
  document.querySelector("#logout").addEventListener("click", event => {
    if (pending || (changed && !confirm("Discard unsaved portfolio changes and sign out?"))) { event.stopImmediatePropagation(); return; }
    changed = false;
  }, true);
  if (!document.querySelector("#workspace").hidden) load();
})();
