"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";

const QUOTES = [
  "Every great story begins with a single word.",
  "Write what you know. Then write what you wish you knew.",
  "The first draft is just you telling yourself the story.",
  "A writer only begins a book. A reader finishes it.",
  "Clarity is the kindness you show your readers.",
  "Good writing is clear thinking made visible.",
  "Write with intention. Edit with compassion.",
  "Ideas are worthless until you write them down.",
  "One page a day builds a book in a year.",
  "Your voice is the one thing no one else can copy.",
];

interface Props {
  visible: boolean;
}

export default function ScrollInspirationBanner({ visible }: Props) {
  const [quote, setQuote] = useState(QUOTES[0]);
  const prevVisible = useRef(false);

  useEffect(() => {
    if (visible && !prevVisible.current) {
      setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    }
    prevVisible.current = visible;
  }, [visible]);

  return (
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        visible ? "max-h-10 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="flex items-center justify-center gap-2 bg-violet-600 px-4 py-2 text-xs font-medium text-white dark:bg-violet-700">
        <Sparkles size={11} className="shrink-0 opacity-80" />
        <span>{quote}</span>
      </div>
    </div>
  );
}
