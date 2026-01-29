import { useEffect, useMemo, useRef, useState } from "react";
import "./chat.css";

type Msg = { role: "user" | "assistant"; content: string };

// Removi props desnecessárias como 'open' e 'onClose'
export default function HeimdallDrawer({
  context,
  apiBase = "http://localhost:8000",
}: {
  context: any;
  apiBase?: string;
}) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "I am Heimdall. Ask about the transactions." },
  ]);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const quick = useMemo(
    () => [
      "Analyze fraud risk",
      "Why is this suspicious?",
      "Show history",
    ],
    []
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
         body: JSON.stringify({ message: msg, context }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply ?? "No reply." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Error connecting to Heimdall API." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <aside className="hd-drawer">
      {/* Header */}
      <div className="hd-top">
        <div>
          <div className="hd-title">Heimdall AI</div>
          <div className="hd-sub">
            {context?.chartTitle ? `Context: ${context.chartTitle}` : "System Active"}
          </div>
        </div>
        <div style={{
            width: 8, height: 8, background: "#00d9ff", 
            borderRadius: "50%", boxShadow: "0 0 8px #00d9ff",
            animation: "pulse 2s infinite"
        }}></div>
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
              <div className="hd-dots">
                <span /><span /><span />
              </div>
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
          placeholder="Ask Heimdall..."
        />
        <button className="hd-send" onClick={() => send(input)} disabled={loading || !input.trim()}>
          ➜
        </button>
      </div>
    </aside>
  );
}