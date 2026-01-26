import { useMemo, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

const API_BASE = "http://localhost:8000";

export default function Chat() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Sou o Heimdall. Pode perguntar." },
  ]);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  async function send() {
    if (!canSend) return;
    const text = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply ?? "Sem resposta." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Erro ao falar com a API." }]);
    } finally {
      setLoading(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0b1220", color: "white" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Heimdall Chat</h1>

        <div
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 16,
            padding: 16,
            height: "70vh",
            overflowY: "auto",
            background: "rgba(255,255,255,0.03)",
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  maxWidth: "80%",
                  padding: "10px 12px",
                  borderRadius: 14,
                  background: m.role === "user" ? "rgba(59,130,246,0.25)" : "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  whiteSpace: "pre-wrap",
                }}
              >
                {m.content}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Digite sua pergunta..."
            style={{
              flex: 1,
              padding: "12px 14px",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(255,255,255,0.04)",
              color: "white",
              outline: "none",
            }}
          />
          <button
            onClick={send}
            disabled={!canSend}
            style={{
              padding: "12px 16px",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.18)",
              background: canSend ? "rgba(59,130,246,0.9)" : "rgba(255,255,255,0.08)",
              color: "white",
              cursor: canSend ? "pointer" : "not-allowed",
              fontWeight: 600,
            }}
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
}
