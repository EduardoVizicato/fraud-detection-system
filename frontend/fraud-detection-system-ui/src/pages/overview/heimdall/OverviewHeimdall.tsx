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
        title: "Explain high risk reason",
        prompt: "Why was this transaction marked as high risk?",
        tags: [
          { label: "Investigation", tone: "info" },
          { label: "Risk", tone: "risk" },
        ],
        convo: [
          { role: "user", content: "Why was this transaction marked as high risk?" },
          {
            role: "assistant",
            content:
              "Main signals:\n• Unusual IP + recent device fingerprint change\n• Value above customer standard\n• Repeated attempts in short interval\n\nSuggestion: apply additional verification (2FA) and review chargeback history.",
          },
        ],
      },
      {
        title: "Reduce false positives",
        prompt: "How do I reduce false positives without losing recall?",
        tags: [
          { label: "Metrics", tone: "info" },
          { label: "Adjustment", tone: "warn" },
        ],
        convo: [
          { role: "user", content: "How do I reduce false positives without losing recall?" },
          {
            role: "assistant",
            content:
              "Practical path:\n1) Threshold adjustment guided by Precision–Recall\n2) Exception rules for legitimate recurrent behaviors\n3) Stability features (historical device/IP) to separate new vs. habitual behavior\n\nI can suggest an initial threshold and an A/B test plan.",
          },
        ],
      },
      {
        title: "Analyze batch patterns",
        prompt: "Show common patterns in confirmed fraud cases",
        tags: [
          { label: "Insights", tone: "safe" },
          { label: "Fraud", tone: "risk" },
        ],
        convo: [
          { role: "user", content: "Show common patterns in confirmed fraud cases" },
          {
            role: "assistant",
            content:
              "Recurring patterns (confirmed fraud):\n• Spike in attempts per minute\n• Geographic divergence between IP and address\n• First card use at high-risk merchant\n\nIf you want, I can return the top 10 signals and how to prioritize triage.",
          },
        ],
      },
      {
        title: "Investigation checklist",
        prompt: "Give me a quick checklist to investigate an alert",
        tags: [
          { label: "Playbook", tone: "info" },
          { label: "Triage", tone: "warn" },
        ],
        convo: [
          { role: "user", content: "Give me a quick checklist to investigate an alert" },
          {
            role: "assistant",
            content:
              "Checklist (60–90s):\n• Customer history (volume, average ticket)\n• IP/device: new vs. known\n• Time/location: anomalies\n• Repetitions and failed attempts\n• Data coherence (address/phone)\n\nIf 2+ strong signals → escalate verification.",
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
              Heimdall • investigation copilot
            </div>

            <h1 className="ov-h1">
              Heimdall:
              <span className="ov-h1Accent"> explain and act</span> with confidence.
            </h1>

            <p className="ov-lead">
              Heimdall transforms signals and metrics into a clear explanation: why a case rose to high risk,
              what evidence matters, and what next step reduces fraud without increasing false positives.
            </p>

            <div className="ov-cta">
              <Link className="lp-btn lp-btnPrimary" to="/login">
                Enter to use Heimdall
              </Link>
              <Link className="lp-btn lp-btnGhost" to="/overview/dashboard">
                View Dashboard (overview)
              </Link>
            </div>

            <div className="ov-mini">
              <span className="ov-chip ov-info" /> Blue = confidence/info
              <span className="ov-chip ov-warn" /> Orange = alert
              <span className="ov-chip ov-risk" /> Red = risk
              <span className="ov-chip ov-safe" /> Green = ok
            </div>
          </div>

          {/* RIGHT: examples selector + preview */}
          <div className="ov-heroRight">
            <div className="ov-card">
              <div className="ov-cardTop">
                <div className="ov-cardTitle">Try examples</div>
                <div className="ov-cardHint">Preview just like the app chat</div>
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
                <div className="ov-previewTitle">Heimdall — Conversation (preview)</div>
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
              title="Quick explanations"
              desc="Summarize main signals (IP, device, behavior) and the score reason."
              tone="info"
            />
            <InfoCard
              title="Prioritized triage"
              desc="Classifies cases by risk and suggests next verification steps."
              tone="warn"
            />
            <InfoCard
              title="Less fraud, less noise"
              desc="Helps reduce false positives without dropping recall, with practical recommendations."
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