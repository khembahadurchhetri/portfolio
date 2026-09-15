"use client";
import { useEffect, useState } from "react";
import defaults from "../assets/portfolio-defaults.json";
export function safePortfolioUrl(value, fallback = "") {
  return typeof value === "string" && (/^https:\/\//i.test(value) || /^\/(?!\/)[\w/.-]+(?:#[\w-]+)?$/.test(value)) ? value : fallback;
}
export default function usePortfolio() {
  const [content, setContent] = useState(defaults);
  useEffect(() => {
    const update = () => {
      const saved = window.PORTFOLIO_CONTENT;
      if (saved && Array.isArray(saved.projects)) setContent(saved);
    };
    update();
    window.addEventListener("portfolio:loaded", update);
    return () => window.removeEventListener("portfolio:loaded", update);
  }, []);
  return { ...content, photo: safePortfolioUrl(content.photo, defaults.photo), cv: safePortfolioUrl(content.cv, defaults.cv) };
}
