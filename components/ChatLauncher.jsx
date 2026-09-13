"use client";
import { useState } from "react";
export default function ChatLauncher() {
  const [state, setState] = useState("Chat");
  function open() {
    if (state === "Loading…") return;
    setState("Loading…");
    const script = document.createElement("script");
    script.src = "https://hamrochatbot.vercel.app/widget.js";
    script.dataset.org = "portfolio-khem";
    script.dataset.key = "ba939fe4ebf1aefb30293c5bd97fd013e0293df14d13266a";
    script.onload = () => setState("");
    script.onerror = () => setState("Retry chat");
    document.body.append(script);
  }
  return state ? (
    <button className="chat-launcher" onClick={open}>
      {state}
    </button>
  ) : null;
}
