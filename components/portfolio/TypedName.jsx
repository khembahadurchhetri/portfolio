"use client";
import { useEffect, useState } from "react";

const name = "Khem Bahadur\nChhetri";

export default function TypedName() {
  const [length, setLength] = useState(0);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer;
    let position = 0;
    function type() {
      position += 1;
      setLength(position);
      if (position < name.length) {
        const next = name[position];
        timer = setTimeout(type, next === "\n" ? 500 : next === " " ? 260 : 150 + position % 3 * 35);
      }
    }
    function start() {
      clearTimeout(timer);
      setReduced(preference.matches);
      if (preference.matches) { setLength(name.length); return; }
      position = 0;
      setLength(0);
      timer = setTimeout(type, 450);
    }
    start();
    preference.addEventListener("change", start);
    return () => { clearTimeout(timer); preference.removeEventListener("change", start); };
  }, []);

  const [first, last = ""] = name.slice(0, length).split("\n");
  const secondLine = length > name.indexOf("\n");
  const cursor = !reduced && <i className={`typing-cursor${length === name.length ? " is-finished" : ""}`} />;
  return (
    <h1 className="hero-name reveal" aria-label="Khem Bahadur Chhetri">
      <b className="typing-line" aria-hidden="true">
        <b className="typing-measure">Khem Bahadur</b>
        <b className="typing-text">{first}{!secondLine && cursor}</b>
      </b>
      <span className="typing-line" aria-hidden="true">
        <b className="typing-measure">Chhetri</b>
        <b className="typing-text">{last}{secondLine && cursor}</b>
      </span>
    </h1>
  );
}
