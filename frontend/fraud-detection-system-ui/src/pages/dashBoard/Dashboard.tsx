import { useEffect, useMemo, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import Chat from "../chatBot/Chat";

const API_BASE = "http://localhost:8000";

type CsvResponse = {
  file: string;
  columns: string[];
  rows: Record<string, any>[];
};

function num(v: any) {
  const n = Number(String(v).replace(",", "."));
  return Number.isNaN(n) ? null : n;
}

function fmt(n: any) {
  const x = Number(n);
  if (Number.isNaN(x)) return String(n ?? "");
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 4 }).format(x);
}

const nivoTheme = {
  text: { fill: "rgba(11,18,32,.82)" },
  axis: {
    ticks: { text: { fill: "rgba(11,18,32,.70)", fontSize: 12 } },
    legend: { text: { fill: "rgba(11,18,32,.70)", fontSize: 12 } },
  },
  grid: { line: { stroke: "rgba(11,18,32,.08)", strokeWidth: 1 } },
  tooltip: { container: { fontSize: 12 } },
};

export default function Dashboard() {
  const [files, setFiles] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>("processed/audit_kpis.csv");
  const [csv, setCsv] = useState<CsvResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch(`${API_BASE}/api/data/csv-files?subdir=processed`);
      const json = await res.json();
      setFiles(json.files || []);
      // se existir audit_kpis, preferir
      if (json.files?.includes("processed/audit_kpis.csv")) setSelected("processed/audit_kpis.csv");
      else if (json.files?.length) setSelected(json.files[0]);
    })();
  }, []);

  useEffect(() => {
    if (!selected) return;

    (async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ rel_path: selected, limit: "2000" });
        const res = await fetch(`${API_BASE}/api/data/csv?${params.toString()}`);
        const json: CsvResponse = await res.json();
        setCsv(json);
      } finally {
        setLoading(false);
      }
    })();
  }, [selected]);

  const isKpiLike = useMemo(() => (csv?.rows?.length ?? 0) === 1, [csv]);

  const kpi = useMemo(() => {
    if (!csv || !isKpiLike) return null;
    return csv.rows[0];
  }, [csv, isKpiLike]);

  const kpiCards = useMemo(() => {
    if (!kpi) return [];
    return [
      { label: "Total", value: kpi.total_cases ?? kpi["total_cases"], tone: "info" as const },
      { label: "Pred. Fraud", value: kpi.predicted_fraud ?? kpi["predicted_fraud"], tone: "warn" as const },
      { label: "Actual Fraud", value: kpi.true_fraud ?? kpi["true_fraud"], tone: "risk" as const },
      { label: "Precision", value: kpi.precision ?? kpi["precision"], tone: "info" as const },
      { label: "Recall", value: kpi.recall ?? kpi["recall"], tone: "safe" as const },
    ];
  }, [kpi]);

  const confusionBar = useMemo(() => {
    if (!kpi) return [];
    const tp = num(kpi.tp); const fp = num(kpi.fp); const fn = num(kpi.fn); const tn = num(kpi.tn);
    return [
      { metric: "TP", value: tp ?? 0, colorKey: "safe" },
      { metric: "FP", value: fp ?? 0, colorKey: "warn" },
      { metric: "FN", value: fn ?? 0, colorKey: "risk" },
      { metric: "TN", value: tn ?? 0, colorKey: "info" },
    ];
  }, [kpi]);

  const lineData = useMemo(() => {
    if (!csv || isKpiLike || csv.rows.length < 2) return null;
    const cols = csv.columns;

    let yKey: string | null = null;
    for (const c of cols) {
      const v = csv.rows[0]?.[c];
      if (num(v) !== null) { yKey = c; break; }
    }
    if (!yKey) return null;

    return [{
      id: yKey,
      data: csv.rows.map((r, i) => ({ x: i + 1, y: num(r[yKey]) ?? 0 })),
    }];
  }, [csv, isKpiLike]);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const context = useMemo(() => {
    const base: any ={
      page: "dashboard",
      selectedFile: selected,
      csvColumns: csv?.columns ?? [],
      rowsPreview: (csv?.rows ?? []).slice(0,5),
    };

    if(isKpiLike && kpi){
      base.view = "kpi_overview";
      base.chart = { id: "confusion_matrix", title: "Confusion Matrix (TP/FP/FN/TN)"};

      base.kpis = {
        total_cases: num(kpi.tota_cases ?? kpi["total_cases"]),
        predicted_fraud: num(kpi.predicted_fraud ?? kpi["predicted_fraud"]),
        true_fraud: num(kpi.true_fraud ?? kpi["true_fraud"]),
        tp: num(kpi.tp),
        fp: num(kpi.fp),
        fn: num(kpi.fn),
        tn: num(kpi.tn),
        precision: num(kpi.precision),
        recall: num(kpi.recall),
      };

      base.confusionBar = confusionBar;
      base.kpiCards = kpiCards.map((c) => ({...c, value: num(c.value) ?? c.value}));
    } else {
      base.view = "series";
      base.chart = {id: "series_auto", title: "Series (auto)"};
      base.series = lineData ? lineData[0]: null;
    }

    return base

  }, [selected, csv, isKpiLike, kpi, confusionBar, kpiCards, lineData]);

  return (
    <div>
      <div className="container section">
        <div className="dash-head">
          <div>
            <div className="dash-title">Dashboard</div>
            <div className="dash-sub">KPIs and charts with strong visual hierarchy.</div>
          </div>

          <div className="dash-toolbar">
            <div className="dash-field">
              <div className="dash-label">CSV</div>
              <select className="dash-select" value={selected} onChange={(e) => setSelected(e.target.value)}>
                {files.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button
                  onClick={() => setDrawerOpen((v) => !v)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 14,
                    border: "1px solid rgba(0,116,217,.55)",
                    background: "linear-gradient(135deg, #0074d9, rgba(0,116,217,.75))",
                    color: "white",
                    fontWeight: 900,
                    cursor: "pointer",
                  }}
                >
                  Heimdall
                </button>
              </div>

              <Chat
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                context={context}
              />
            </div>
          </div>
        </div>

        {loading && <div style={{ marginTop: 12 }} className="p">Loading…</div>}

        {isKpiLike && kpi && (
          <>
            <div className="grid grid-4" style={{ marginTop: 14 }}>
              {kpiCards.map((c) => (
                <div className="card" key={c.label}>
                  <div className="kpi">
                    <div className="kpi-label">{c.label}</div>
                    <div className="kpi-value">{fmt(c.value)}</div>
                    <div className={`kpi-chip chip-${c.tone}`}>
                      {c.tone === "risk" ? "RISK" : c.tone === "warn" ? "ALERT" : c.tone === "safe" ? "OK" : "INFO"}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-2" style={{ marginTop: 14 }}>
              <div className="card">
                <div className="card-title">Confusion Matrix (TP/FP/FN/TN)</div>
                <div className="small">Green = fraud catch • Red = missed fraud • Orange = false positive</div>
                <div style={{ height: 360, marginTop: 10 }}>
                  <ResponsiveBar
                    data={confusionBar}
                    keys={["value"]}
                    indexBy="metric"
                    margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                    padding={0.35}
                    valueScale={{ type: "linear" }}
                    indexScale={{ type: "band", round: true }}
                    colors={({ data }) => {
                      const k = (data as any).colorKey;
                      if (k === "risk") return "#ff4136";
                      if (k === "warn") return "#ff851b";
                      if (k === "safe") return "#2ecc40";
                      return "#0074d9";
                    }}
                    borderRadius={10}
                    axisBottom={{ tickSize: 5, tickPadding: 8 }}
                    axisLeft={{ tickSize: 5, tickPadding: 8 }}
                    theme={nivoTheme as any}
                    enableLabel={false}
                    gridYValues={5}
                  />
                </div>
              </div>

              <div className="card">
                <div className="card-title">Preview</div>
                <div className="small">CSV Sample (1 row)</div>
                <div style={{ overflowX: "auto", marginTop: 10 }}>
                  <table className="table">
                    <thead>
                      <tr>
                        {csv?.columns?.slice(0, 10).map((c) => <th key={c}>{c}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {csv?.columns?.slice(0, 10).map((c) => <td key={c}>{String(kpi[c] ?? "")}</td>)}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Série temporal (quando CSV tem muitas linhas) */}
        {!isKpiLike && csv && lineData && (
          <div className="card" style={{ marginTop: 14 }}>
            <div className="card-title">Series (auto)</div>
            <div className="small">Detected first numeric column and plotted by index</div>
            <div style={{ height: 420, marginTop: 10 }}>
              <ResponsiveLine
                data={lineData}
                margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                xScale={{ type: "point" }}
                yScale={{ type: "linear", stacked: false, min: "auto", max: "auto" }}
                curve="monotoneX"
                enablePoints={false}
                useMesh={true}
                theme={nivoTheme as any}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}