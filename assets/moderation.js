(() => {
  const panel = document.querySelector("#moderation");
  if (!panel) return;
  const list = panel.querySelector("#submission-list"),
    message = panel.querySelector("#moderation-status");
  async function refresh() {
    message.textContent = "Loading submissions…";
    try {
      const entries = await window.JournalBackend.request(
        "/api/admin/submissions",
      );
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
            if (
              !confirm(
                approve
                  ? "Publish this journal with the submitter’s name?"
                  : "Reject this submission?",
              )
            )
              return;
            card.querySelectorAll("button").forEach((b) => (b.disabled = true));
            try {
              await window.JournalBackend.request(
                "/api/admin/submissions/review",
                {
                  method: "POST",
                  body: JSON.stringify({ p_id: entry.id, p_approve: approve }),
                },
              );
              await refresh();
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
      list.replaceChildren();
      message.textContent =
        "Could not load the approval queue. " + error.message;
    }
  }
  panel
    .querySelector("#refresh-submissions")
    .addEventListener("click", refresh);
  // Clear private submission text whenever the owner workspace is hidden.
  new MutationObserver(() => {
    if (document.querySelector("#workspace").hidden) {
      list.replaceChildren();
      message.textContent = "";
    }
  }).observe(document.querySelector("#workspace"), {
    attributes: true,
    attributeFilter: ["hidden"],
  });
})();
