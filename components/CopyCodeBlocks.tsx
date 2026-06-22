"use client";

import { useEffect } from "react";

export default function CopyCodeBlocks() {
  useEffect(() => {
    const container = document.querySelector("[data-post-content]");
    if (!container) return;

    const pres = container.querySelectorAll("pre");
    pres.forEach((pre) => {
      if (pre.querySelector("[data-copy-btn]")) return;

      pre.style.position = "relative";
      const btn = document.createElement("button");
      btn.setAttribute("data-copy-btn", "true");
      btn.textContent = "Copy";
      btn.className =
        "absolute top-2 right-2 rounded-md bg-stone-700 px-2.5 py-1 text-xs font-medium text-stone-200 opacity-0 transition-opacity hover:bg-stone-600";
      pre.style.setProperty("--tw-copy-opacity", "0");

      pre.addEventListener("mouseenter", () => (btn.style.opacity = "1"));
      pre.addEventListener("mouseleave", () => (btn.style.opacity = "0"));

      btn.addEventListener("click", async () => {
        const code = pre.querySelector("code")?.textContent ?? pre.textContent ?? "";
        await navigator.clipboard.writeText(code);
        btn.textContent = "Copied!";
        setTimeout(() => (btn.textContent = "Copy"), 1500);
      });

      pre.appendChild(btn);
    });
  }, []);

  return null;
}
