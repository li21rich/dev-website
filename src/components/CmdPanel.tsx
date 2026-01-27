import { useEffect, useState, useRef } from "react";

const PROMPT_TEXT = "Enter a task for Agent:   ";
const USER_COMMAND = "subscribe to github on yt";

// The system logs that appear AFTER the user finishes typing
const SYSTEM_LOGS = [
  { text: "", delay: 100 }, // Empty line after input
  { text: "# Press 'Alt + A' at any time to force quit.", delay: 100 },
  { text: "# Conducting first screen read...", delay: 600 },
  { text: "# Screenshot taken...", delay: 400 },
  { text: "# Starting screen read...", delay: 400 },
  { text: "# [0/3] Sending to OmniParser (Size: (1200, 750))...", delay: 400 },
  { text: "# [1/3] Omniparser API Response Received: 2.8619s", delay: 2860 },
  { text: "# [2/3] Parsed_lists: 0.0053s", delay: 10 },
  { text: "# [3/3] Gemini captioning: 2.7741s", delay: 2770 },
  { text: "# Total screen read time: 5.6413s", delay: 100 },
  { text: "", delay: 100 },
  { text: "Step 1", delay: 600 },
  { text: "Thought: The current screen shows the code editor with `main.py` open.", delay: 400 },
  { text: "Action: key_hotkey", delay: 500 },
  { text: "Args: {'ks': ['alt', 'tab']}", delay: 200 },
];

export default function CmdPanel() {
  const [lines, setLines] = useState<string[]>([]);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const runSequence = async () => {
      if (!mountedRef.current) return;

      // 1. Reset
      setLines([PROMPT_TEXT]);
      
      // 2. Typewriter Effect for User Input
      let currentInput = "";
      for (let i = 0; i < USER_COMMAND.length; i++) {
        // Random typing delay between 30ms and 90ms for realism
        const typingDelay = Math.random() * 60 + 30; 
        await new Promise((r) => setTimeout(r, typingDelay));
        
        if (!mountedRef.current) return;
        
        currentInput += USER_COMMAND[i];
        setLines([PROMPT_TEXT + currentInput]);
      }

      // 3. Pause before system response (simulate hitting Enter)
      await new Promise((r) => setTimeout(r, 800));
      if (!mountedRef.current) return;

      // 4. Process System Logs
      for (const log of SYSTEM_LOGS) {
        await new Promise((r) => setTimeout(r, log.delay));
        if (!mountedRef.current) return;
        setLines((prev) => [...prev, log.text]);
      }

      // 5. Wait at the end, then restart loop
      await new Promise((r) => setTimeout(r, 4000));
      if (mountedRef.current) {
        runSequence();
      }
    };

    runSequence();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return (
    <div className="mt-12 max-w-[720px] rounded-xl bg-black/80 border border-primary-reddish/20 p-4 font-mono text-sm text-primary-reddish shadow-lg backdrop-blur min-h-[400px]">
      {lines.map((l, i) => (
        <div key={i} className="whitespace-pre-wrap leading-relaxed">
          {l}
        </div>
      ))}
      <span className="animate-pulse">▍</span>
    </div>
  );
}