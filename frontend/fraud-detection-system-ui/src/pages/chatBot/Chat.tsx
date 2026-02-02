import { useEffect, useMemo, useRef, useState } from "react";
import "./chat.css";

type Msg = { role: "user" | "assistant"; content: string };

export default function HeimdallDrawer({
  open,
  onClose,
  context,
  apiBase = "http://localhost:8000",
}: {
  open: boolean;
  onClose: () => void;
  context: any;
  apiBase?: string;
}) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "I am Copilot. Ask me about the current chart, alerts, or metrics." },
  ]);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const quick = useMemo(
    () => [
      "Explain what this chart is showing",
      "What is the main anomaly here?",
      "How to reduce false positives without losing recall?",
      "What action do you recommend now?",
    ],
    []
  );

  useEffect(() => {
    if (!open) return;
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 40);
  }, [open, messages]);

  async function send(text: string) {
    const msg = text.trim();
    if (!msg || loading) return;

    setInput("");
    setMessages((m) => [...m, { role: "user", content: msg }]);
    setLoading(true);

    try {
      const res = await fetch(`${apiBase}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, context }), // ✅ sends context
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply ?? "No reply." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Error connecting to API." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className={`hd-overlay ${open ? "show" : ""}`} onClick={onClose} />

      <aside className={`hd-drawer ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="hd-top">
          <div>
            <div className="hd-title">Copilot</div>
            <div className="hd-sub">
              {context?.chartTitle ? `Context: ${context.chartTitle}` : "Context: dashboard"}
            </div>
          </div>

          <button className="hd-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="hd-quick">
          {quick.map((q) => (
            <button key={q} className="hd-chip" onClick={() => send(q)} type="button">
              {q}
            </button>
          ))}
        </div>

        <div className="hd-feed">
          {messages.map((m, i) => (
            <div key={i} className={`hd-row ${m.role}`}>
              <div className={`hd-bubble ${m.role}`}>
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="hd-row assistant">
              <div className="hd-bubble assistant hd-thinking">
                <span className="hd-dots" aria-label="Copilot thinking">
                  <span />
                  <span />
                  <span />
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="hd-inputBar">
          <input
            className="hd-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Ask Copilot"
          />
          <button className="hd-send" onClick={() => send(input)} disabled={loading || !input.trim()}>
            {loading ? "..." : "Send"}
          </button>
        </div>
      </aside>
    </>
  );
}