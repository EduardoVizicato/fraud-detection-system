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
    { role: "assistant", content: "Sou o Heimdall. Pergunte sobre o gráfico atual, alertas ou métricas." },
  ]);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const quick = useMemo(
    () => [
      "Explique o que esse gráfico está mostrando",
      "Qual é a principal anomalia aqui?",
      "Como reduzir falsos positivos sem perder recall?",
      "Que ação você recomenda agora?",
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
        body: JSON.stringify({ message: msg, context }), // ✅ manda contexto
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply ?? "Sem resposta." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Erro ao falar com a API." }]);
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
            <div className="hd-title">Heimdall</div>
            <div className="hd-sub">
              {context?.chartTitle ? `Contexto: ${context.chartTitle}` : "Contexto: dashboard"}
            </div>
          </div>

          <button className="hd-close" onClick={onClose} aria-label="Fechar">
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
                <span className="hd-dots" aria-label="Heimdall pensando">
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
            placeholder="Pergunte ao Heimdall…"
          />
          <button className="hd-send" onClick={() => send(input)} disabled={loading || !input.trim()}>
            {loading ? "..." : "Enviar"}
          </button>
        </div>
      </aside>
    </>
  );
}
