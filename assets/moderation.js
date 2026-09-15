(() => {
  const panel = document.querySelector("#moderation");
  if (!panel) return;
  function confirmReview(approve, title) {
    return new Promise((resolve) => {
      const dialog = document.createElement("dialog");
      dialog.className = "review-dialog";
      const heading = document.createElement("h2");
      heading.id = "review-heading";
      heading.textContent = approve ? "Publish this journal?" : "Reject this journal?";
      dialog.setAttribute("aria-labelledby", heading.id);
      const description = document.createElement("p");
      description.textContent = approve
        ? `“${title}” will become public with its author's name and photo.`
        : `“${title}” will stay unpublished and leave the approval queue.`;
      const actions = document.createElement("div");
      actions.className = "actions";
      const cancel = document.createElement("button");
      cancel.textContent = "Cancel";
      cancel.autofocus = true;
      const submit = document.createElement("button");
      submit.className = approve ? "primary" : "danger";
      submit.textContent = approve ? "Approve & publish" : "Reject submission";
      cancel.onclick = () => dialog.close("cancel");
      submit.onclick = () => dialog.close("confirm");
      dialog.addEventListener("close", () => {
        resolve(dialog.returnValue === "confirm");
        dialog.remove();
      }, { once: true });
      actions.append(cancel, submit);
      dialog.append(heading, description, actions);
      panel.append(dialog);
      dialog.showModal();
    });
  }
  const list = panel.querySelector("#submission-list"),
    message = panel.querySelector("#moderation-status");
  let known = new Set(), signature = "", busy = false, generation = 0;
  const workspace = document.querySelector("#workspace");
  const badge = document.querySelector("#pending-alert");
  const originalTitle = document.title;
  async function refresh(silent = false) {
    if (busy || workspace.hidden || !window.JournalBackend?.enabled || panel.querySelector("dialog") || panel.querySelector("button:disabled")) return;
    busy = true;
    const current = generation;
    if (!silent) message.textContent = "Loading submissions…";
    try {
      const entries = await window.JournalBackend.request(
        "/api/admin/submissions",
      );
      if (workspace.hidden || current !== generation) return;
      const newCount = entries.filter(entry => !known.has(entry.id)).length;
      if (newCount) window.adminNotify?.(`${newCount} journal submissions need your approval.`);
      known = new Set(entries.map(entry => entry.id));
      if (badge) { badge.hidden = !entries.length; badge.textContent = `${entries.length} pending journals`; }
      document.title = entries.length ? `(${entries.length} pending) ${originalTitle}` : originalTitle;
      const nextSignature = JSON.stringify(entries);
      if (silent && nextSignature === signature) return;
      signature = nextSignature;
      list.replaceChildren();
      for (const entry of entries) {
        const card = document.createElement("article");
        card.className = "submission-card";
        const title = document.createElement("h3");
        title.textContent = entry.title;
        const author = document.createElement("p");
        author.textContent = "Submitted by " + entry.author_name;
        author.textContent += " · " + (entry.category || "Community");
        const body = document.createElement("p");
        body.className = "submission-body";
        body.textContent = entry.text;
        card.append(title, author, body);
        if (entry.image) {
          const photo = document.createElement("img");
          photo.alt = "Photo submitted for review";
          photo.className = "submission-photo";
          photo.loading = "lazy";
          const openPhoto = document.createElement("button");
          openPhoto.type = "button";
          openPhoto.textContent = "Preview photo";
          openPhoto.addEventListener("click", async () => {
            try {
              photo.src = await window.JournalBackend.media(entry.image, true);
              if (!photo.isConnected) card.append(photo);
            } catch (error) {
              message.textContent = error.message;
            }
          });
          card.append(openPhoto);
        }
        for (const approve of [true, false]) {
          const button = document.createElement("button");
          button.type = "button";
          button.textContent = approve ? "Approve & publish" : "Reject";
          button.addEventListener("click", async () => {
            if (!(await confirmReview(approve, entry.title))) return;
            card.querySelectorAll("button").forEach((b) => (b.disabled = true));
            try {
              await window.JournalBackend.request(
                "/api/admin/submissions/review",
                {
                  method: "POST",
                  body: JSON.stringify({ p_id: entry.id, p_approve: approve }),
                },
              );
              card.remove();
              await refresh();
              window.dispatchEvent(new Event("journal:reviewed"));
              message.textContent = approve ? "Journal approved and published." : "Submission rejected.";
            } catch (error) {
              message.textContent = error.message;
              card
                .querySelectorAll("button")
                .forEach((b) => (b.disabled = false));
            }
          });
          card.append(button);
        }
        list.append(card);
      }
      message.textContent = entries.length
        ? `${entries.length} awaiting approval.`
        : "No pending submissions.";
    } catch (error) {
      if (workspace.hidden || current !== generation) return;
      if (!silent) list.replaceChildren();
      message.textContent =
        "Could not load the approval queue. " + error.message;
    } finally { busy = false; }
  }
  panel
    .querySelector("#refresh-submissions")
    .addEventListener("click", () => refresh());
  // Clear private submission text whenever the owner workspace is hidden.
  new MutationObserver(() => {
    if (document.querySelector("#workspace").hidden) {
      generation += 1; known.clear(); signature = "";
      if (badge) badge.hidden = true;
      document.title = originalTitle;
      panel.querySelector("dialog")?.close("cancel");
      list.replaceChildren();
      message.textContent = "";
    }
  }).observe(document.querySelector("#workspace"), {
    attributes: true,
    attributeFilter: ["hidden"],
  });
  window.addEventListener("portfolio:owner", () => refresh());
  document.addEventListener("visibilitychange", () => { if (!document.hidden) refresh(true); });
  setInterval(() => { if (!document.hidden) refresh(true); }, 30000);
  if (!workspace.hidden) refresh();
})();
