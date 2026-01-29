import { useEffect, useMemo, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import Chat from "../chatBot/Chat";

const API_BASE = "http://localhost:8000";

type RealtimeMetrics = {
  type: string;
  timestamp: number;
  total_processed: number;
  total_fraud_predictions: number;
  avg_amount: number;
  fraud_rate: number;
  fraud_by_minute: Array<{ minute: number; count: number }>;
  top_alerts: Array<{ time: number; amount: number; confidence: number; actual: number; predicted: number }>;
  batch_accuracy: number | null;
};

export default function Dashboard() {
  const [metrics, setMetrics] = useState<RealtimeMetrics | null>(null);
  const [history, setHistory] = useState<RealtimeMetrics[]>([]);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;

    const ws = new WebSocket("ws://localhost:8000/api/ws/metrics");
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as RealtimeMetrics;
        setMetrics(data);
        setHistory((prev) => [...prev.slice(-99), data]); // Mantém últimas 100
      } catch {
        // ignore
      }
    };

    return () => ws.close();
  }, [isLive]);

  const fraudLineData = useMemo(() => {
    if (!metrics?.fraud_by_minute?.length) return null;
    return [{
      id: "Fraude/min",
      data: metrics.fraud_by_minute.map((p) => ({
        x: String(p.minute),
        y: p.count,
      })),
    }];
  }, [metrics?.fraud_by_minute]);

  const topAlertsData = useMemo(() => {
    if (!metrics?.top_alerts?.length) return [];
    return metrics.top_alerts.map((a, i) => ({
      id: `#${i + 1}`,
      amount: a.amount,
      confidence: (a.confidence * 100).toFixed(1),
    }));
  }, [metrics?.top_alerts]);

  const accuracyTrend = useMemo(() => {
    return [{
      id: "Acurácia",
      data: history
        .filter((m) => m.batch_accuracy !== null)
        .map((m, i) => ({
          x: i,
          y: (m.batch_accuracy! * 100),
        })),
    }];
  }, [history]);

  const nivoTheme = {
    text: { fill: "rgba(11,18,32,.82)" },
    axis: {
      ticks: { text: { fill: "rgba(11,18,32,.70)", fontSize: 12 } },
    },
    grid: { line: { stroke: "rgba(11,18,32,.08)", strokeWidth: 1 } },
  };

  return (
    <div className="container section">
      <div className="dash-head">
        <div>
          <div className="dash-title">Dashboard (Live)</div>
          <div className="dash-sub">Processamento em tempo real com predições.</div>
        </div>

        <button
          onClick={() => setIsLive(!isLive)}
          style={{
            padding: "10px 16px",
            borderRadius: 8,
            border: "1px solid rgba(0,116,217,.55)",
            background: isLive ? "#0074d9" : "gray",
            color: "white",
            fontWeight: 900,
            cursor: "pointer",
          }}
        >
          {isLive ? "🔴 Live" : "⏸️ Pausado"}
        </button>
      </div>

      {metrics && (
        <>
          <div className="grid grid-4" style={{ marginTop: 14 }}>
            <div className="card">
              <div className="kpi">
                <div className="kpi-label">Processados</div>
                <div className="kpi-value">{metrics.total_processed.toLocaleString()}</div>
              </div>
            </div>
            <div className="card">
              <div className="kpi">
                <div className="kpi-label">Fraudes Detectadas</div>
                <div className="kpi-value">{metrics.total_fraud_predictions}</div>
                <div className="kpi-chip chip-risk">ALERT</div>
              </div>
            </div>
            <div className="card">
              <div className="kpi">
                <div className="kpi-label">Taxa de Fraude</div>
                <div className="kpi-value">{(metrics.fraud_rate * 100).toFixed(2)}%</div>
              </div>
            </div>
            <div className="card">
              <div className="kpi">
                <div className="kpi-label">Valor Médio</div>
                <div className="kpi-value">${metrics.avg_amount.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-2" style={{ marginTop: 14 }}>
            <div className="card">
              <div className="card-title">Fraudes por Minuto</div>
              <div style={{ height: 360, marginTop: 10 }}>
                {fraudLineData ? (
                  <ResponsiveLine
                    data={fraudLineData}
                    margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                    xScale={{ type: "point" }}
                    yScale={{ type: "linear", min: 0 }}
                    curve="monotoneX"
                    enablePoints={false}
                    useMesh={true}
                    theme={nivoTheme as any}
                  />
                ) : (
                  <div>Carregando…</div>
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-title">Top Alertas (Confiança)</div>
              <div style={{ height: 360, marginTop: 10 }}>
                {topAlertsData.length ? (
                  <ResponsiveBar
                    data={topAlertsData}
                    keys={["confidence"]}
                    indexBy="id"
                    margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                    colors="#ff6b6b"
                    theme={nivoTheme as any}
                  />
                ) : (
                  <div>Carregando…</div>
                )}
              </div>
            </div>
          </div>

          <div className="card" style={{ marginTop: 14 }}>
            <div className="card-title">Acurácia do Modelo (Trend)</div>
            <div style={{ height: 300, marginTop: 10 }}>
              {accuracyTrend[0]?.data?.length ? (
                <ResponsiveLine
                  data={accuracyTrend}
                  margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                  xScale={{ type: "point" }}
                  yScale={{ type: "linear", min: 0, max: 100 }}
                  curve="monotoneX"
                  enablePoints={true}
                  useMesh={true}
                  theme={nivoTheme as any}
                />
              ) : (
                <div>Carregando…</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}