"use client";
import { useRef, useState } from "react";
export default function SubmissionForm() {
  const detailsRef = useRef(null);
  const summaryRef = useRef(null);
  const [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("Sending for review…");
    const form = event.currentTarget;
    try {
      const fields = new FormData(form);
      const photo = fields.get("photo");
      const payload = Object.fromEntries(fields);
      delete payload.photo;
      if (photo?.size) {
        if (photo.size > 1048576)
          throw new Error("Please choose a photo smaller than 1 MB.");
        if (!["image/png", "image/jpeg", "image/webp"].includes(photo.type))
          throw new Error("Use a PNG, JPEG or WebP photo.");
        payload.photo = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(new Error("Could not read the photo."));
          reader.readAsDataURL(photo);
        });
      }
      const response = await fetch("/api/journal/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Submission failed.");
      form.reset();
      detailsRef.current.open = false;
      summaryRef.current.focus();
      setMessage("Thank you! Your journal is awaiting owner approval.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="community-journal">
      <div className="section-wrap">
        <details ref={detailsRef}>
          <summary ref={summaryRef}>
            Share a journal of your own
          </summary>
          <p>
            Your name and journal will be public only after Khem approves them.
          </p>
          <form onSubmit={submit}>
            <label>
              Category
              <select name="category" defaultValue="Notes">
                {[
                  "Books",
                  "Movies",
                  "Notes",
                  "Photos & videos",
                  "Vlogs",
                  "Quotes",
                  "News",
                  "Community",
                ].map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>
            <label>
              Your name
              <input name="name" maxLength={80} autoComplete="name" required />
            </label>
            <label>
              Title
              <input name="title" maxLength={140} required />
            </label>
            <label>
              Your journal
              <textarea
                name="text"
                rows={5}
                minLength={10}
                maxLength={5000}
                required
              />
            </label>
            <div hidden>
              <label>
                Leave empty
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <label>
              Photo (optional, up to 1 MB)
              <input
                name="photo"
                type="file"
                accept="image/png,image/jpeg,image/webp"
              />
            </label>
            <p>
              Your photo stays private while your submission is awaiting review.
            </p>
            <label className="submission-consent">
              <input type="checkbox" name="consent" required /> I agree to have
              my name, journal and attached photo published if approved.
            </label>
            <button className="btn-solid" disabled={busy}>
              {busy ? "Sending…" : "Submit for approval"}
            </button>
          </form>
        </details>
        <p role="status" aria-live="polite">{message}</p>
      </div>
    </section>
  );
}
