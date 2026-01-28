import { useMemo, useState } from "react";
import "./overviewHeimdall.css";
import { Link } from "react-router-dom";

type Msg = { role: "user" | "assistant"; content: string };

type Example = {
  title: string;
  prompt: string;
  tags: Array<{ label: string; tone: "info" | "warn" | "risk" | "safe" }>;
  convo: Msg[];
};

export default function OverviewHeimdall() {
  const examples: Example[] = useMemo(
    () => [
      {
        title: "Explique o motivo do alto risco",
        prompt: "Por que essa transação foi marcada como alto risco?",
        tags: [
          { label: "Investigação", tone: "info" },
          { label: "Risco", tone: "risk" },
        ],
        convo: [
          { role: "user", content: "Por que essa transação foi marcada como alto risco?" },
          {
            role: "assistant",
            content:
              "Sinais principais:\n• IP incomum + mudança recente de device fingerprint\n• Valor acima do padrão do cliente\n• Tentativas repetidas em curto intervalo\n\nSugestão: aplicar verificação adicional (2FA) e revisar histórico de chargebacks.",
          },
        ],
      },
      {
        title: "Reduzir falsos positivos",
        prompt: "Como eu reduzo falsos positivos sem perder recall?",
        tags: [
          { label: "Métricas", tone: "info" },
          { label: "Ajuste", tone: "warn" },
        ],
        convo: [
          { role: "user", content: "Como eu reduzo falsos positivos sem perder recall?" },
          {
            role: "assistant",
            content:
              "Caminho prático:\n1) Ajuste de threshold guiado por Precision–Recall\n2) Regras de exceção para comportamentos recorrentes legítimos\n3) Features de estabilidade (device/IP histórico) para separar comportamento novo vs. habitual\n\nPosso sugerir um threshold inicial e um plano de teste A/B.",
          },
        ],
      },
      {
        title: "Analisar padrão em lote",
        prompt: "Mostre padrões comuns nos casos de fraude confirmada",
        tags: [
          { label: "Insights", tone: "safe" },
          { label: "Fraude", tone: "risk" },
        ],
        convo: [
          { role: "user", content: "Mostre padrões comuns nos casos de fraude confirmada" },
          {
            role: "assistant",
            content:
              "Padrões recorrentes (fraude confirmada):\n• Pico de tentativas por minuto\n• Divergência geográfica entre IP e endereço\n• Primeiro uso do cartão em merchant de alto risco\n\nSe quiser, eu retorno os top 10 sinais e como priorizar a triagem.",
          },
        ],
      },
      {
        title: "Checklist de investigação",
        prompt: "Me dê um checklist rápido para investigar um alerta",
        tags: [
          { label: "Playbook", tone: "info" },
          { label: "Triagem", tone: "warn" },
        ],
        convo: [
          { role: "user", content: "Me dê um checklist rápido para investigar um alerta" },
          {
            role: "assistant",
            content:
              "Checklist (60–90s):\n• Histórico do cliente (volume, ticket médio)\n• IP/device: novo vs. conhecido\n• Horário/localização: anomalias\n• Repetições e tentativas falhas\n• Coerência de dados (endereço/telefone)\n\nSe 2+ sinais fortes → escalonar verificação.",
          },
        ],
      },
    ],
    []
  );

  const [idx, setIdx] = useState(0);
  const active = examples[idx];

  return (
    <div className="ov">
      <div className="lp-container">
        {/* HERO */}
        <section className="ov-hero">
          <div className="ov-heroLeft">
            <div className="ov-pill">
              <span className="ov-dot ov-dotSafe" />
              Heimdall • copiloto de investigação
            </div>

            <h1 className="ov-h1">
              Heimdall:
              <span className="ov-h1Accent"> explique e aja</span> com confiança.
            </h1>

            <p className="ov-lead">
              O Heimdall transforma sinais e métricas em uma explicação clara: por que um caso subiu para alto risco,
              quais evidências importam e qual próximo passo reduz fraude sem aumentar falsos positivos.
            </p>

            <div className="ov-cta">
              <Link className="lp-btn lp-btnPrimary" to="/login">
                Entrar para usar o Heimdall
              </Link>
              <Link className="lp-btn lp-btnGhost" to="/overview/dashboard">
                Ver Dashboard (overview)
              </Link>
            </div>

            <div className="ov-mini">
              <span className="ov-chip ov-info" /> Azul = confiança/info
              <span className="ov-chip ov-warn" /> Laranja = alerta
              <span className="ov-chip ov-risk" /> Vermelho = risco
              <span className="ov-chip ov-safe" /> Verde = ok
            </div>
          </div>

          {/* RIGHT: examples selector + preview */}
          <div className="ov-heroRight">
            <div className="ov-card">
              <div className="ov-cardTop">
                <div className="ov-cardTitle">Experimente exemplos</div>
                <div className="ov-cardHint">Preview igual ao chat do app</div>
              </div>

              <div className="ov-examples">
                {examples.map((e, i) => (
                  <button
                    key={e.title}
                    className={`ov-exItem ${i === idx ? "isActive" : ""}`}
                    onClick={() => setIdx(i)}
                    type="button"
                  >
                    <div className="ov-exTitle">{e.title}</div>
                    <div className="ov-exPrompt">“{e.prompt}”</div>
                    <div className="ov-tags">
                      {e.tags.map((t) => (
                        <span key={t.label} className={`ov-tag tone-${t.tone}`}>
                          {t.label}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="ov-preview">
              <div className="ov-previewTop">
                <div className="ov-previewDots">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="ov-previewTitle">Heimdall — Conversa (preview)</div>
              </div>

              <div className="ov-previewBody">
                {active.convo.map((m, j) => (
                  <div key={j} className={`ov-bubble ${m.role === "user" ? "user" : "bot"}`}>
                    {m.content}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2 */}
        <section className="ov-section">
          <div className="ov-grid3">
            <InfoCard
              title="Explicações rápidas"
              desc="Resuma os sinais principais (IP, device, comportamento) e o motivo do score."
              tone="info"
            />
            <InfoCard
              title="Triagem com prioridade"
              desc="Classifica casos por risco e sugere próximos passos de verificação."
              tone="warn"
            />
            <InfoCard
              title="Menos fraude, menos ruído"
              desc="Ajuda a reduzir falsos positivos sem derrubar recall, com recomendações práticas."
              tone="safe"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function InfoCard({
  title,
  desc,
  tone,
}: {
  title: string;
  desc: string;
  tone: "info" | "warn" | "safe";
}) {
  return (
    <div className="ov-infoCard">
      <div className={`ov-icIcon tone-${tone}`} />
      <div className="ov-icTitle">{title}</div>
      <div className="ov-icDesc">{desc}</div>
    </div>
  );
}
