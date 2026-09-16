"use client";
import { useEffect, useState } from "react";

const NAME = "Khem Bahadur Chhetri";
const ROLE = "Full Stack Developer";

export default function TypedName() {
  const [length, setLength] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer;

    function type(position) {
      setLength(position);
      if (position < NAME.length) {
        const next = NAME[position];
        const delay = next === " " ? 260 : 150 + (position % 3) * 35;
        timer = setTimeout(() => type(position + 1), delay);
      }
    }

    function start() {
      clearTimeout(timer);
      const isReduced = preference.matches;
      setReduced(isReduced);
      if (isReduced) {
        setLength(NAME.length);
        return;
      }
      setLength(0);
      timer = setTimeout(() => type(1), 450);
    }

    start();
    preference.addEventListener("change", start);
    return () => {
      clearTimeout(timer);
      preference.removeEventListener("change", start);
    };
  }, []);

  const isFinished = length >= NAME.length;
  const cursor = !reduced && (
    <i className={`typing-cursor${isFinished ? " is-finished" : ""}`} />
  );

  return (
    <h1 className="hero-name reveal" aria-label={`${NAME}, ${ROLE}`}>
      <span className="typing-line" aria-hidden="true">
        <b className="typing-measure">{NAME}</b>
        <b className="typing-text">
          {NAME.slice(0, length)}
          {cursor}
        </b>
      </span>
      <strong className="hero-role">{ROLE}</strong>
    </h1>
  );
}