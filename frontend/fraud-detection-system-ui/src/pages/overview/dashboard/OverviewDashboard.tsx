import { useMemo, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import "./overviewDashboard.css";
import { Link } from "react-router-dom";

type Tone = "info" | "warn" | "risk" | "safe";

type Scenario = {
  title: string;
  subtitle: string;
  tags: Array<{ label: string; tone: Tone }>;
  kpis: Array<{ label: string; value: string; tone: Tone }>;
  kind: "bar" | "line";
  bar?: { data: any[]; indexBy: string; keys: string[]; colorsByIndex?: Record<string, string> };
  line?: { data: any[] };
};

const nivoTheme = {
  text: { fill: "rgba(11,18,32,.82)" },
  axis: {
    ticks: { text: { fill: "rgba(11,18,32,.70)", fontSize: 12 } },
    legend: { text: { fill: "rgba(11,18,32,.70)", fontSize: 12 } },
  },
  grid: { line: { stroke: "rgba(11,18,32,.08)", strokeWidth: 1 } },
  tooltip: { container: { fontSize: 12 } },
};

const toneHex: Record<Tone, string> = {
  info: "#0074d9",
  warn: "#ff851b",
  risk: "#ff4136",
  safe: "#2ecc40",
};

export default function OverviewDashboard() {
  const scenarios: Scenario[] = useMemo(
    () => [
      {
        title: "Visão Geral (KPIs)",
        subtitle: "Métricas principais + leitura rápida por cor",
        tags: [
          { label: "KPIs", tone: "info" },
          { label: "Triagem", tone: "warn" },
        ],
        kpis: [
          { label: "Total", value: "71.202", tone: "info" },
          { label: "Pred. Fraude", value: "91", tone: "warn" },
          { label: "Fraude real", value: "123", tone: "risk" },
          { label: "Precision", value: "0,6179", tone: "info" },
          { label: "Recall", value: "0,8352", tone: "safe" },
        ],
        kind: "bar",
        bar: {
          indexBy: "metric",
          keys: ["value"],
          data: [
            { metric: "TP", value: 76, colorKey: "safe" },
            { metric: "FP", value: 47, colorKey: "warn" },
            { metric: "FN", value: 15, colorKey: "risk" },
            { metric: "TN", value: 71064, colorKey: "info" },
          ],
          colorsByIndex: { TP: toneHex.safe, FP: toneHex.warn, FN: toneHex.risk, TN: toneHex.info },
        },
      },
      {
        title: "Comparação de Modelos",
        subtitle: "Baseline vs Balanced • precisão e recall",
        tags: [
          { label: "Comparação", tone: "info" },
          { label: "Decisão", tone: "safe" },
        ],
        kpis: [
          { label: "Baseline F1", value: "0,62", tone: "warn" },
          { label: "Balanced F1", value: "0,71", tone: "safe" },
          { label: "Δ Recall", value: "+0,09", tone: "safe" },
          { label: "Δ Precision", value: "-0,02", tone: "warn" },
        ],
        kind: "bar",
        bar: {
          indexBy: "metric",
          keys: ["baseline", "balanced"],
          data: [
            { metric: "Precision", baseline: 0.64, balanced: 0.62 },
            { metric: "Recall", baseline: 0.79, balanced: 0.88 },
            { metric: "F1", baseline: 0.62, balanced: 0.71 },
          ],
        },
      },
      {
        title: "Feature Importance",
        subtitle: "Quais sinais pesam mais na decisão do modelo",
        tags: [
          { label: "Explicabilidade", tone: "info" },
          { label: "Modelo", tone: "info" },
        ],
        kpis: [
          { label: "Top feature", value: "device_change", tone: "info" },
          { label: "Top 3", value: "ip_risk, velocity, geo", tone: "warn" },
        ],
        kind: "bar",
        bar: {
          indexBy: "feature",
          keys: ["importance"],
          data: [
            { feature: "device_change", importance: 0.34 },
            { feature: "ip_risk", importance: 0.28 },
            { feature: "velocity", importance: 0.22 },
            { feature: "geo_mismatch", importance: 0.18 },
            { feature: "first_time_merchant", importance: 0.14 },
          ],
        },
      },
      {
        title: "Tendência de Alertas",
        subtitle: "Picos e padrões nas últimas 24h",
        tags: [
          { label: "Série", tone: "info" },
          { label: "Monitoramento", tone: "safe" },
        ],
        kpis: [
          { label: "Alertas (24h)", value: "318", tone: "warn" },
          { label: "Fraude (24h)", value: "17", tone: "risk" },
          { label: "Aprovadas", value: "7.104", tone: "safe" },
        ],
        kind: "line",
        line: {
          data: [
            {
              id: "alertas",
              data: Array.from({ length: 24 }, (_, i) => ({
                x: `${i}h`,
                y: [6, 8, 7, 9, 12, 15, 18, 16, 14, 13, 11, 10, 12, 14, 18, 22, 28, 24, 19, 16, 14, 12, 10, 9][i],
              })),
            },
            {
              id: "fraude",
              data: Array.from({ length: 24 }, (_, i) => ({
                x: `${i}h`,
                y: [0, 0, 1, 0, 1, 2, 1, 1, 0, 1, 1, 0, 1, 1, 1, 2, 3, 2, 1, 1, 1, 0, 1, 0][i],
              })),
            },
          ],
        },
      },
    ],
    []
  );

  const [idx, setIdx] = useState(0);
  const active = scenarios[idx];

  return (
    <div className="ov od">
      <div className="lp-container">
        <section className="ov-hero od-hero">
          {/* LEFT */}
          <div className="ov-heroLeft">
            <div className="ov-pill">
              <span className="ov-dot ov-dotSafe" />
              Dashboard • visão clara do risco
            </div>

            <h1 className="ov-h1">
              Dashboard:
              <span className="ov-h1Accent"> métricas e gráficos</span> para decidir rápido.
            </h1>

            <p className="ov-lead">
              Um painel feito para leitura rápida: navy como base (confiança), cores saturadas só para o que exige
              atenção imediata (fraude/alerta). O preview ao lado é o mesmo estilo do sistema real.
            </p>

            <div className="ov-cta">
              <Link className="lp-btn lp-btnPrimary" to="/login">Entrar para usar o Dashboard</Link>
              <Link className="lp-btn lp-btnGhost" to="/overview/heimdall">Ver Heimdall (overview)</Link>
            </div>

            <div className="ov-mini">

            </div>
          </div>

          {/* RIGHT */}
          <div className="ov-heroRight">
            <div className="ov-card">
              <div className="ov-cardTop">
                <div className="ov-cardTitle">Cenários do painel</div>
                <div className="ov-cardHint">Clique e veja o preview “igual ao sistema”</div>
              </div>

              <div className="ov-examples">
                {scenarios.map((s, i) => (
                  <button
                    key={s.title}
                    className={`ov-exItem ${i === idx ? "isActive" : ""}`}
                    onClick={() => setIdx(i)}
                    type="button"
                  >
                    <div className="ov-exTitle">{s.title}</div>
                    <div className="ov-exPrompt">{s.subtitle}</div>
                    <div className="ov-tags">
                      {s.tags.map((t) => (
                        <span key={t.label} className={`ov-tag tone-${t.tone}`}>{t.label}</span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* PREVIEW (mini dashboard real) */}
            <div className="od-preview">
              <div className="od-top">
                <div className="od-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="od-title">FraudShield Dashboard — Preview</div>
              </div>

              <div className="od-body">
                {/* KPI cards */}
                <div className={`od-kpiGrid ${active.kpis.length >= 5 ? "cols5" : "cols4"}`}>
                  {active.kpis.map((k) => (
                    <div key={k.label} className="od-kpiCard">
                      <div className="od-kpiLabel">{k.label}</div>
                      <div className={`od-kpiValue tone-${k.tone}`}>{k.value}</div>
                      <div className={`od-kpiChip tone-${k.tone}`}>
                        {k.tone === "risk" ? "RISCO" : k.tone === "warn" ? "ALERTA" : k.tone === "safe" ? "OK" : "INFO"}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Charts */}
                <div className="od-chartCard">
                  <div className="od-chartHead">
                    <div className="od-chartName">
                      {active.kind === "line" ? "Tendência" : "Gráfico"}
                    </div>
                    <div className="od-chartHint">Nivo • mesma paleta do app</div>
                  </div>

                  <div className="od-chart">
                    {active.kind === "bar" && active.bar && (
                      <ResponsiveBar
                        data={active.bar.data}
                        keys={active.bar.keys}
                        indexBy={active.bar.indexBy}
                        margin={{ top: 12, right: 12, bottom: 44, left: 56 }}
                        padding={0.35}
                        valueScale={{ type: "linear" }}
                        indexScale={{ type: "band", round: true }}
                        enableLabel={false}
                        borderRadius={10}
                        axisBottom={{ tickSize: 5, tickPadding: 8 }}
                        axisLeft={{ tickSize: 5, tickPadding: 8 }}
                        theme={nivoTheme as any}
                        colors={(bar) => {
                          // caso TP/FP/FN/TN
                          const metric = String((bar.data as any)?.metric ?? "");
                          if (active.bar?.colorsByIndex?.[metric]) return active.bar.colorsByIndex[metric];
                          // baseline/balanced etc
                          if (bar.id === "balanced") return toneHex.safe;
                          if (bar.id === "baseline") return toneHex.warn;
                          return toneHex.info;
                        }}
                      />
                    )}

                    {active.kind === "line" && active.line && (
                      <ResponsiveLine
                        data={active.line.data}
                        margin={{ top: 12, right: 12, bottom: 44, left: 56 }}
                        xScale={{ type: "point" }}
                        yScale={{ type: "linear", stacked: false, min: "auto", max: "auto" }}
                        curve="monotoneX"
                        enablePoints={false}
                        useMesh={true}
                        theme={nivoTheme as any}
                        colors={({ id }) => (String(id).includes("fraude") ? toneHex.risk : toneHex.info)}
                        axisBottom={{ tickRotation: -20, tickSize: 5, tickPadding: 10 }}
                        axisLeft={{ tickSize: 5, tickPadding: 10 }}
                      />
                    )}
                  </div>
                </div>

                <div className="od-note">
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
