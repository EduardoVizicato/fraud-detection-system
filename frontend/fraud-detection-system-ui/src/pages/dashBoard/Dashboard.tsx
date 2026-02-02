import { useEffect, useMemo, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";
import Chat from "../chatBot/Chat";
import "./Dashboard.css";

const API_BASE = "http://localhost:8000";

// --- Utilitários de Formatação e Lógica ---
const num = (v: any) => {
  const n = Number(String(v).replace(",", "."));
  return Number.isNaN(n) ? 0 : n;
};

const fmt = (n: any) => {
  const x = Number(n);
  if (Number.isNaN(x)) return String(n ?? "");
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 3 }).format(x);
};

const nivoTheme = {
  text: { fill: "#4a5568" },
  axis: {
    ticks: { text: { fontSize: 11 } },
    legend: { text: { fontSize: 12, fontWeight: 700 } },
  },
  grid: { line: { stroke: "#edf2f7", strokeWidth: 1 } },
};

export default function Dashboard() {
  const [files, setFiles] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>("processed/audit_kpis.csv");
  const [csv, setCsv] = useState<{ file: string; columns: string[]; rows: any[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Carregar lista de arquivos
  useEffect(() => {
    (async () => {
      const res = await fetch(`${API_BASE}/api/data/csv-files?subdir=processed`);
      const json = await res.json();
      setFiles(json.files || []);
    })();
  }, []);

  // Carregar dados do arquivo selecionado
  useEffect(() => {
    if (!selected) return;
    (async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ rel_path: selected, limit: "2000" });
        const res = await fetch(`${API_BASE}/api/data/csv?${params.toString()}`);
        const json = await res.json();
        setCsv(json);
      } finally { setLoading(false); }
    })();
  }, [selected]);

  // --- Lógica de Explicabilidade (IA Context) ---
  // Mapeamos os pesos das features para que a IA saiba "o porquê"
  const featureInsights = {
    V4: "Major Fraud Driver (Positive Correlation)",
    V14: "Strong Legitimacy Indicator (Negative Correlation)",
    V10: "Strong Legitimacy Indicator (Negative Correlation)",
    V12: "Safety Feature",
    V11: "Fraud Accelerator",
  };

  const chatContext = useMemo(() => {
    if (!csv) return {};
    return {
      current_file: selected,
      data_preview: csv.rows.slice(0, 5),
      insights: featureInsights,
      model_logic: "Weights > 0 pull towards Class 1 (Fraud). Weights < 0 pull towards Class 0 (Legit)."
    };
  }, [csv, selected]);

  // --- VIEW 1: AUDIT KPIs (Comparação de Modelos) ---
  const renderAuditKpis = () => {
    if (!csv || csv.rows.length < 1) return null;
    const m1 = csv.rows[0]; // Baseline
    const m2 = csv.rows[1] || m1; // New Version
    
    const metrics = [
      { k: "precision", l: "Precision", t: "info" },
      { k: "recall", l: "Recall", t: "safe" },
      { k: "predicted_fraud", l: "Pred. Fraud", t: "warn" },
      { k: "true_fraud", l: "Actual Fraud", t: "risk" },
    ];

    const confusionData = ["tp", "fp", "fn", "tn"].map(k => ({
      metric: k.toUpperCase(),
      "Baseline": num(m1[k]),
      "Current Model": num(m2[k]),
    }));

    return (
      <>
        <div className="grid grid-4" style={{ marginTop: 20 }}>
          {metrics.map(m => (
            <div className="card kpi-card-enhanced" key={m.k}>
              <div className="kpi-label">{m.l}</div>
              <div className="kpi-main-row">
                <span className="kpi-value">{fmt(m2[m.k])}</span>
                {csv.rows.length > 1 && (
                  <span className={`kpi-diff ${num(m2[m.k]) - num(m1[m.k]) >= 0 ? 'pos' : 'neg'}`}>
                    {(num(m2[m.k]) - num(m1[m.k]) > 0 ? "+" : "") + fmt(num(m2[m.k]) - num(m1[m.k]))}
                  </span>
                )}
              </div>
              <div className={`kpi-bar-indicator bg-${m.t}`} />
            </div>
          ))}
        </div>
        <div className="card" style={{ marginTop: 20 }}>
          <div className="card-title">Confusion Matrix Comparison</div>
          <div style={{ height: 350 }}>
            <ResponsiveBar
              data={confusionData}
              keys={["Baseline", "Current Model"]}
              indexBy="metric"
              groupMode="grouped"
              margin={{ top: 50, right: 30, bottom: 50, left: 60 }}
              colors={["#cbd5e0", "#0074d9"]}
              theme={nivoTheme}
              borderRadius={4}
              legends={[{ dataFrom: 'keys', anchor: 'top-right', direction: 'row', translateY: -40, itemWidth: 120, itemHeight: 20 }]}
            />
          </div>
        </div>
      </>
    );
  };

  // --- VIEW 2: FEATURE IMPORTANCE (Corrigida) ---
  const renderFeatureImportance = () => {
    const data = (csv?.rows || []).slice(0, 15).map(r => ({
      id: r.feature,
      value: num(r.weight), //
      color: num(r.weight) > 0 ? "#ff4136" : "#0074d9"
    })).sort((a,b) => Math.abs(b.value) - Math.abs(a.value));

    return (
      <div className="card full-width" style={{ marginTop: 20 }}>
        <div className="card-title">Model Decision Drivers (LogReg Weights)</div>
        <div className="small" style={{ marginBottom: 15 }}>
          Red bars increase fraud probability. Blue bars indicate legitimacy drivers.
        </div>
        <div style={{ height: 550 }}>
          <ResponsiveBar
            data={data}
            keys={["value"]}
            indexBy="id"
            layout="horizontal"
            margin={{ top: 20, right: 60, bottom: 50, left: 140 }}
            colors={({ data }) => (data as any).color}
            theme={nivoTheme}
            enableLabel={true}
            label={d => `${fmt(d.value)}`}
            labelTextColor="white"
            padding={0.3}
            borderRadius={4}
          />
        </div>
      </div>
    );
  };

  // --- VIEW 3: TOP ALERTS (Com Explicabilidade) ---
  const renderTopAlerts = () => (
    <div className="card full-width" style={{ marginTop: 20 }}>
      <div className="card-title">High-Confidence Fraud Alerts</div>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Test Index</th>
              <th>Fraud Probability</th>
              <th>Actual Class</th>
              <th>Outcome</th>
              <th>Primary Driver</th>
            </tr>
          </thead>
          <tbody>
            {(csv?.rows || []).slice(0, 15).map((r, i) => (
              <tr key={i}>
                <td>#{r.test_index}</td>
                <td>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                     <div className="progress-bg"><div className="progress-fill" style={{ width: `${num(r.fraud_probability)*100}%` }} /></div>
                     <strong>{(num(r.fraud_probability) * 100).toFixed(2)}%</strong>
                   </div>
                </td>
                <td>{r.y_true === "1" ? "FRAUD" : "NORMAL"}</td>
                <td><span className={`kpi-diff ${r.outcome === 'TP' ? 'pos' : 'neg'}`}>{r.outcome}</span></td>
                <td><span className="small-info">{r.y_true === "1" ? "High V4/V11 Values" : "Normal Pattern"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // --- VIEW 4: METRICS & COMPARISON (Balanced vs Baseline) ---
  const renderMetrics = () => (
    <div className="grid grid-2" style={{ marginTop: 20 }}>
      {csv?.rows.map((r, i) => (
        <div className="card" key={i}>
          <div className="kpi-label">{r.model ? `Model: ${r.model}` : `Class: ${r.class === "1" ? "Fraud" : "Normal"}`}</div>
          <div className="kpi-value">F1: {fmt(r.f1_score || r.fraud_f1_score)}</div>
          <div className="grid grid-2" style={{ marginTop: 10 }}>
             <div className="small">Precision: {fmt(r.precision || r.fraud_precision)}</div>
             <div className="small">Recall: {fmt(r.recall || r.fraud_recall)}</div>
          </div>
          <div className={`kpi-bar-indicator bg-info`} style={{ width: `${num(r.recall || r.fraud_recall)*100}%` }} />
        </div>
      ))}
    </div>
  );

  // --- Seletor de Renderização ---
  const renderMainView = () => {
    if (!csv) return null;
    const file = selected.toLowerCase();
    if (file.includes("audit_kpis")) return renderAuditKpis();
    if (file.includes("feature_importance")) return renderFeatureImportance();
    if (file.includes("top_alerts")) return renderTopAlerts();
    if (file.includes("metrics") || file.includes("comparison") || file.includes("summary")) return renderMetrics();
    
    return (
      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-title">Raw Data Preview</div>
        <div className="table-container">
          <table className="table">
            <thead><tr>{csv.columns.map(c => <th key={c}>{c}</th>)}</tr></thead>
            <tbody>{csv.rows.slice(0,10).map((r, i) => <tr key={i}>{csv.columns.map(c => <td key={c}>{r[c]}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="container section">
      <div className="dash-head">
        <div>
          <div className="dash-title">Heimdall Audit Center</div>
          <div className="dash-sub">Advanced fraud model explainability and audit logs.</div>
        </div>
        <div className="dash-toolbar">
          <select className="dash-select" value={selected} onChange={(e) => setSelected(e.target.value)}>
            {files.map(f => <option key={f} value={f}>{f.split('/').pop()}</option>)}
          </select>
          <button className="btn-heimdall" onClick={() => setDrawerOpen(true)}>AI Insights</button>
        </div>
      </div>
      
      {loading ? <div className="loading-state">Synchronizing Data...</div> : renderMainView()}

      <Chat open={drawerOpen} onClose={() => setDrawerOpen(false)} context={chatContext} />
    </div>
  );
}