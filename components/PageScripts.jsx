"use client";
import { useEffect } from "react";
const common = ["/assets/journal-config.js", "/assets/journal-backend.js"];
const sources = {
  home: [
    ...common,
    "/assets/portfolio-content.js",
    "/assets/portfolio.js",
    "/assets/scenery.js",
    "/assets/journal.js",
  ],
  admin: [...common, "/admin/notifications.js", "/admin/studio.js", "/admin/portfolio.js", "/assets/moderation.js"],
  entry: [...common, "/assets/entry.js"],
};
const loading = new Map();
function load(src) {
  if (!loading.has(src))
    loading.set(
      src,
      new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        script.onerror = () => {
          loading.delete(src);
          reject(new Error("Unable to load " + src));
        };
        document.body.append(script);
      }),
    );
  return loading.get(src);
}
export default function PageScripts({ kind }) {
  useEffect(() => {
    (async () => {
      for (const src of sources[kind]) await load(src);
    })().catch((error) => {
      const target =
        document.querySelector("#status") ||
        document.querySelector(".journal-grid");
      if (target) target.textContent = error.message;
    });
  }, [kind]);
  return null;
}
