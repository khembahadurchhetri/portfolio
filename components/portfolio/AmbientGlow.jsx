"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function AmbientGlow() {
  const [sections, setSections] = useState([]);
  useEffect(() => {
    setSections([...document.querySelectorAll("#hero, .portfolio-sections > section")]);
  }, []);
  return sections.map((section, index) => createPortal(
    <div className="ambient-glow" aria-hidden="true" style={{ "--glow-delay": `${-index * 3}s` }}>
      <div className="ambient-wash" />
      {Array.from({ length: 14 }, (_, dot) => {
        const seed = (index + 1) * 37 + dot * 61;
        return <i key={dot} className="ambient-firefly" style={{
          left: `${8 + seed * 17 % 84}%`, top: `${9 + seed * 23 % 80}%`,
          "--spark-size": `${2 + seed % 3 * .5}px`,
          "--spark-time": `${4 + seed % 6}s`,
          "--spark-delay": `${-(seed % 17)}s`,
          "--spark-x": `${seed % 2 ? 14 : -18}px`,
        }} />;
      })}
    </div>, section, section.id || String(index),
  ));
}
