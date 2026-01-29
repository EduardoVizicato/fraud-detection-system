import { useEffect, useMemo, useRef, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import "./Dashboard.css";
import {
  analyzeFraud,
  updateHistory,
  loadHistoryFromStorage,
  getStats,
  type Transaction,
  type AnalysisResult,
} from "../../services/fraudDetector";
import HeimdallDrawer from "../chatBot/Chat";

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

type Msg = { role: "user" | "assistant"; content: string };

export default function Dashboard() {
  const [metrics, setMetrics] = useState<RealtimeMetrics | null>(null);
  const [history, setHistory] = useState<RealtimeMetrics[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [recentAnalysis, setRecentAnalysis] = useState<AnalysisResult | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);
  
  // Chat state
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "I am Heimdall. Ask me about the current chart, alerts, or metrics." },
  ]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Dados mock para teste
  const mockMetrics: RealtimeMetrics = {
    type: "metrics",
    timestamp: Date.now(),
    total_processed: 3300,
    total_fraud_predictions: 0,
    avg_amount: 67,
    fraud_rate: 0,
    fraud_by_minute: [
      { minute: 0, count: 5 },
      { minute: 1, count: 3 },
      { minute: 2, count: 6 },
      { minute: 3, count: 2 },
      { minute: 4, count: 7 },
      { minute: 5, count: 4 },
      { minute: 6, count: 8 },
      { minute: 7, count: 5 },
      { minute: 8, count: 6 },
      { minute: 9, count: 3 },
      { minute: 10, count: 4 },
      { minute: 11, count: 7 },
    ],
    top_alerts: [
      { time: Date.now(), amount: 150, confidence: 0.92, actual: 1, predicted: 1 },
      { time: Date.now() - 60000, amount: 89, confidence: 0.78, actual: 1, predicted: 1 },
      { time: Date.now() - 120000, amount: 234, confidence: 0.65, actual: 1, predicted: 0 },
      { time: Date.now() - 180000, amount: 45, confidence: 0.88, actual: 1, predicted: 1 },
      { time: Date.now() - 240000, amount: 190, confidence: 0.71, actual: 1, predicted: 1 },
      { time: Date.now() - 300000, amount: 67, confidence: 0.82, actual: 0, predicted: 1 },
      { time: Date.now() - 360000, amount: 123, confidence: 0.76, actual: 1, predicted: 1 },
      { time: Date.now() - 420000, amount: 200, confidence: 0.69, actual: 1, predicted: 0 },
    ],
    batch_accuracy: 0.95,
  };

  // Gera histórico com acurácia variada
  const mockHistory: RealtimeMetrics[] = Array.from({ length: 20 }, (_, i) => ({
    ...mockMetrics,
    timestamp: Date.now() - i * 5000,
    batch_accuracy: 0.85 + Math.random() * 0.15,
  }));

  // Inicializa histórico de fraude na primeira vez
  useEffect(() => {
    loadHistoryFromStorage();
    // Dados mock iniciais — usar estatísticas locais se existirem
    try {
      const s = getStats();
      setMetrics({
        ...mockMetrics,
        total_processed: s.transactionsCount || mockMetrics.total_processed,
        total_fraud_predictions: 0,
        avg_amount: s.avgAmount || mockMetrics.avg_amount,
        fraud_rate: 0,
      });
    } catch (e) {
      setMetrics(mockMetrics);
    }
    setHistory(mockHistory);
  }, []);


  useEffect(() => {
    if (!isLive) return;

    const ws = new WebSocket("ws://localhost:8000/api/ws/metrics");
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as RealtimeMetrics;
        setMetrics((prev) => {
          if (!prev) return data;

          // If server sends older snapshot, keep local
          if (data.timestamp && prev.timestamp && data.timestamp < prev.timestamp) {
            return prev;
          }

          const localProcessed = prev.total_processed || 0;
          const localFrauds = prev.total_fraud_predictions || 0;
          const serverProcessed = data.total_processed || 0;
          const serverFrauds = data.total_fraud_predictions || 0;

          const total_processed = Math.max(localProcessed, serverProcessed);
          const total_fraud_predictions = Math.max(localFrauds, serverFrauds);

          const fraud_rate = total_processed > 0 ? total_fraud_predictions / total_processed : 0;

          // Weighted average for avg_amount when both sides have counts
          const avg_amount = (() => {
            if (localProcessed === 0) return data.avg_amount || 0;
            if (serverProcessed === 0) return prev.avg_amount || 0;
            return ((prev.avg_amount || 0) * localProcessed + (data.avg_amount || 0) * serverProcessed) / (localProcessed + serverProcessed);
          })();

          return {
            ...data,
            total_processed,
            total_fraud_predictions,
            fraud_rate,
            avg_amount,
          } as RealtimeMetrics;
        });

        setHistory((prev) => [...prev.slice(-99), data]); // Mantém últimas 100
      } catch {
        // ignore
      }
    };

    return () => ws.close();
  }, [isLive]);

  // WebSocket para transações individuais (Fraud Detection)
  useEffect(() => {
    if (!isLive) return;

    const ws = new WebSocket("ws://localhost:8000/api/ws/transactions");
    
    ws.onmessage = (event) => {
      try {
        const transaction = JSON.parse(event.data) as Transaction;

        // Analisa fraude usando heurísticas
        const analysis = analyzeFraud(transaction);
        setRecentAnalysis(analysis);
        setAnalysisHistory((prev) => [...prev.slice(-49), analysis]); // Últimas 50

        // Atualiza histórico
        updateHistory(transaction);

        // Atualiza KPIs locais (se aplicável)
        setMetrics((prev) => {
          const isFraud = analysis.recommendation === "FRAUD" ? 1 : 0;
          if (!prev) {
            return {
              ...mockMetrics,
              total_processed: 1,
              total_fraud_predictions: isFraud,
              fraud_rate: isFraud ? 1 : 0,
              avg_amount: transaction.amount,
            } as RealtimeMetrics;
          }

          const total_processed = (prev.total_processed || 0) + 1;
          const total_fraud_predictions = (prev.total_fraud_predictions || 0) + isFraud;
          const fraud_rate = total_processed > 0 ? total_fraud_predictions / total_processed : 0;
          const avg_amount = ((prev.avg_amount || 0) * (prev.total_processed || 0) + transaction.amount) / total_processed;

          return {
            ...prev,
            total_processed,
            total_fraud_predictions,
            fraud_rate,
            avg_amount,
          };
        });

      } catch (e) {
        console.error("Erro ao processar transação:", e);
      }
    };

    return () => ws.close();
  }, [isLive]);

  useEffect(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 40);
  }, [messages]);

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
    if (!metrics?.top_alerts?.length) {
      return [{ id: "Sem dados", confidence: 0 }];
    }
    return metrics.top_alerts.slice(0, 8).map((a, i) => ({
      id: `Alerta ${i + 1}`,
      confidence: Number((a.confidence * 100).toFixed(1)),
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
    textStyle: { fontSize: 11, fill: "#0a0e1a" },
    axis: {
      domain: { line: { stroke: "transparent" } },
      ticks: { line: { stroke: "#e0e7ff" }, text: { fontSize: 11, fill: "#0a0e1a" } },
      legend: { text: { fontSize: 12, fill: "#0a0e1a" } },
    },
    grid: { line: { stroke: "#f0f3f8" } },
    legends: { text: { fontSize: 11, fill: "#0a0e1a" } },
    tooltip: { container: { background: "#0a0e1a", color: "#fff", fontSize: 11, borderRadius: 4 } },
  };

  const context = useMemo(
    () => ({
      chartTitle: "Realtime Dashboard",
      page: "dashboard",
      metrics,
      recentAnalysis,
      analysisHistory,
    }),
    [metrics, recentAnalysis, analysisHistory]
  );

  async function sendChat(text: string) {
    const msg = text.trim();
    if (!msg || chatLoading) return;

    setInput("");
    setMessages((m) => [...m, { role: "user", content: msg }]);
    setChatLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, context }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply ?? "No reply." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Error connecting to API." }]);
    } finally {
      setChatLoading(false);
    }
  }

  return (
    <div className="dashboard-layout" style={{ 
      display: "flex", 
      flexDirection: "row",
      height: "calc(100vh - 70px)",
      overflow: "hidden",
      background: "#f4f7fa",
      padding: "20px",
      gap: "20px",
      boxSizing: "border-box"
  }}>

      <div className="dashboard-main" style={{ 
        flex: 1,
        overflowY: "auto",
        paddingRight: "10px",
        minWidth: 0
        }}>
        <div className="container section">
          <div className="dash-head">
            <div>
              <div className="dash-title">Dashboard Inteligente</div>
              <div className="dash-sub">Sistema de detecção de fraudes em tempo real</div>
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "rgba(10,14,26,.65)" }}>
                {isLive ? (
                  <>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00d084", animation: "pulse 2s infinite" }} />
                    Live
                  </>
                ) : (
                  <>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#999" }} />
                    Paused
                  </>
                )}
              </div>

              <button
                onClick={() => setIsLive(!isLive)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 10,
                  border: "1px solid rgba(0,120,255,.15)",
                  background: isLive 
                    ? "linear-gradient(135deg, #00d084 0%, rgba(0,208,132,.8) 100%)"
                    : "linear-gradient(135deg, #999 0%, rgba(153,153,153,.8) 100%)",
                  color: "white",
                  fontWeight: 900,
                  cursor: "pointer",
                  fontSize: 12,
                  transition: "all 0.2s ease",
                }}
              >
                {isLive ? "Pausar" : "Live"}
              </button>
            </div>
          </div>

          {metrics && (
            <>
              {/* KPI Cards - Top Row */}
              <div className="grid grid-4" style={{ marginTop: 20 }}>
                <div className="card">
                  <div className="kpi">
                    <div className="kpi-label">📊 Processados</div>
                    <div className="kpi-value">{metrics.total_processed.toLocaleString()}</div>
                  </div>
                </div>
                <div className="card">
                  <div className="kpi">
                    <div className="kpi-label">⚠️ Fraudes Detectadas</div>
                    <div className="kpi-value">{metrics.total_fraud_predictions}</div>
                    <div className="kpi-chip chip-risk">CRÍTICO</div>
                  </div>
                </div>
                <div className="card">
                  <div className="kpi">
                    <div className="kpi-label">📈 Taxa de Fraude</div>
                    <div className="kpi-value">{(metrics.fraud_rate * 100).toFixed(2)}%</div>
                  </div>
                </div>
                <div className="card">
                  <div className="kpi">
                    <div className="kpi-label">💰 Valor Médio</div>
                    <div className="kpi-value">${metrics.avg_amount.toFixed(0)}</div>
                  </div>
                </div>
              </div>

              {/* Real-time Fraud Analysis Card */}
              {recentAnalysis && (
                <div className={`fraud-card ${recentAnalysis.recommendation.toLowerCase()}`} style={{ marginTop: 20 }}>
                  <div className="fraud-header">
                    <div className="fraud-title">🔍 Transação em Análise</div>
                    <span className={`fraud-badge ${recentAnalysis.recommendation.toLowerCase()}`}>
                      {recentAnalysis.recommendation}
                    </span>
                  </div>

                  <div className="fraud-content">
                    <div className="fraud-stat">
                      <div className="fraud-stat-label">ID Transação</div>
                      <div className="fraud-stat-value">#{recentAnalysis.transaction.id.slice(0, 8)}</div>
                    </div>
                    <div className="fraud-stat">
                      <div className="fraud-stat-label">Valor</div>
                      <div className="fraud-stat-value">${recentAnalysis.transaction.amount.toFixed(2)}</div>
                    </div>
                  </div>

                  <div style={{ marginBottom: 14, padding: "12px 0", borderBottom: "1px solid rgba(10,14,26,.06)" }}>
                    <div style={{ fontSize: 13, fontWeight: 900, color: "black", marginBottom: 8 }}>
                      Score de Anomalia: <span style={{ color: recentAnalysis.anomalyScore > 0.7 ? "#ff3d5a" : recentAnalysis.anomalyScore > 0.4 ? "#ff9500" : "#00d084" }}>
                        {(recentAnalysis.anomalyScore * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div style={{ height: 4, background: "rgba(10,14,26,.08)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ 
                        height: "100%", 
                        width: `${recentAnalysis.anomalyScore * 100}%`,
                        background: `linear-gradient(90deg, ${
                          recentAnalysis.anomalyScore > 0.7 ? "#ff3d5a" : 
                          recentAnalysis.anomalyScore > 0.4 ? "#ff9500" : 
                          "#00d084"
                        }, ${
                          recentAnalysis.anomalyScore > 0.7 ? "#ff6b86" : 
                          recentAnalysis.anomalyScore > 0.4 ? "#ffaa33" : 
                          "#33dd99"
                        })`,
                        borderRadius: 2,
                        transition: "width 0.4s ease"
                      }} />
                    </div>
                  </div>

                  <div className="fraud-signals">
                    <div className="fraud-signals-title">🎯 Sinais de Anomalia</div>
                    <div className="signal-item">
                      <div className="signal-name">💵 Valor</div>
                      <div className="signal-bar">
                        <div className="signal-bar-fill" style={{ width: `${recentAnalysis.signals.amountAnomaly * 100}%` }} />
                      </div>
                      <div className="signal-percent">{(recentAnalysis.signals.amountAnomaly * 100).toFixed(0)}%</div>
                    </div>
                    <div className="signal-item">
                      <div className="signal-name">📊 Features</div>
                      <div className="signal-bar">
                        <div className="signal-bar-fill" style={{ width: `${recentAnalysis.signals.featureDistance * 100}%` }} />
                      </div>
                      <div className="signal-percent">{(recentAnalysis.signals.featureDistance * 100).toFixed(0)}%</div>
                    </div>
                    <div className="signal-item">
                      <div className="signal-name">⚡ Velocidade</div>
                      <div className="signal-bar">
                        <div className="signal-bar-fill" style={{ width: `${recentAnalysis.signals.velocityAnomaly * 100}%` }} />
                      </div>
                      <div className="signal-percent">{(recentAnalysis.signals.velocityAnomaly * 100).toFixed(0)}%</div>
                    </div>
                    <div className="signal-item">
                      <div className="signal-name">🕐 Temporal</div>
                      <div className="signal-bar">
                        <div className="signal-bar-fill" style={{ width: `${recentAnalysis.signals.timeAnomaly * 100}%` }} />
                      </div>
                      <div className="signal-percent">{(recentAnalysis.signals.timeAnomaly * 100).toFixed(0)}%</div>
                    </div>
                  </div>

                  <div className="fraud-explanation">
                    <strong>📝 Análise:</strong> {recentAnalysis.explanation}
                  </div>
                </div>
              )}

              {/* Charts Row - 2x2 Grid */}
              <div className="grid grid-2" style={{ marginTop: 0 }}>
                <div className="card">
                  <div className="card-title">📉 Fraudes por Minuto</div>
                  <div className="chart-container">
                    {fraudLineData ? (
                      <ResponsiveLine
                        data={fraudLineData}
                        margin={{ top: 20, right: 20, bottom: 30, left: 50 }}
                        xScale={{ type: "point" }}
                        yScale={{ type: "linear", min: 0 }}
                        curve="catmullRom"
                        enableArea={true}
                        areaOpacity={0.15}
                        enablePoints={true}
                        pointSize={6}
                        pointColor={{ from: "color", modifiers: [["darker", 2]] }}
                        pointBorderColor="#fff"
                        pointBorderWidth={2}
                        isInteractive={true}
                        useMesh={true}
                        theme={nivoTheme}
                        colors={["#00d9ff"]}
                        lineWidth={3}
                        axisBottom={{ tickSize: 5, tickPadding: 5, tickRotation: 0 }}
                        axisLeft={{ tickSize: 5, tickPadding: 5 }}
                      />
                    ) : (
                      <div style={{ color: "rgba(10,14,26,.5)", padding: "20px" }}>Carregando…</div>
                    )}
                  </div>
                </div>

                <div className="card">
                  <div className="card-title">🏆 Top 50 Alertas</div>
                  <div className="chart-container">
                    {topAlertsData?.length > 0 ? (
                      <ResponsiveBar
                        data={topAlertsData}
                        keys={["confidence"]}
                        indexBy="id"
                        margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
                        padding={0.3}
                        colors={["#ff6b3d"]}
                        theme={nivoTheme}
                        axisBottom={{ tickSize: 5, tickPadding: 5, tickRotation: -45, legendPosition: "middle", legendOffset: 40 }}
                        axisLeft={{ tickSize: 5, tickPadding: 5 }}
                        valueScale={{ type: "linear" }}
                        indexScale={{ type: "band", round: true }}
                        borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
                        labelSkipWidth={12}
                        labelSkipHeight={12}
                        isInteractive={true}
                      />
                    ) : (
                      <div style={{ color: "rgba(10,14,26,.5)", padding: "20px" }}>Carregando…</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Second Row */}
              <div className="grid grid-2" style={{ marginTop: 0 }}>
                <div className="card">
                  <div className="card-title">📊 Tendência de Acurácia</div>
                  <div className="chart-container">
                    {accuracyTrend[0]?.data?.length ? (
                      <ResponsiveLine
                        data={accuracyTrend}
                        margin={{ top: 20, right: 20, bottom: 30, left: 50 }}
                        xScale={{ type: "point" }}
                        yScale={{ type: "linear", min: 0, max: 100 }}
                        curve="catmullRom"
                        enableArea={true}
                        areaOpacity={0.15}
                        enablePoints={true}
                        pointSize={6}
                        pointColor={{ from: "color", modifiers: [["darker", 2]] }}
                        pointBorderColor="#fff"
                        pointBorderWidth={2}
                        isInteractive={true}
                        useMesh={true}
                        theme={nivoTheme}
                        colors={["#ff9500"]}
                        lineWidth={3}
                        axisBottom={{ tickSize: 5, tickPadding: 5, tickRotation: 0 }}
                        axisLeft={{ tickSize: 5, tickPadding: 5 }}
                      />
                    ) : (
                      <div style={{ color: "rgba(10,14,26,.5)", padding: "20px" }}>Carregando…</div>
                    )}
                  </div>
                </div>

                <div className="card">
                  <div className="card-title">📋 Histórico (Últimas 10)</div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                    {analysisHistory.length > 0 ? (
                      <div style={{ display: "grid", gap: 8, overflowY: "auto", flex: 1 }}>
                        {analysisHistory.slice(-10).reverse().map((analysis, i) => (
                          <div key={i} style={{
                            padding: 8,
                            background: "rgba(10,14,26,.02)",
                            border: `1px solid ${
                              analysis.recommendation === "FRAUD" ? "rgba(255,61,90,.2)" :
                              analysis.recommendation === "REVIEW" ? "rgba(255,149,0,.2)" :
                              "rgba(0,208,132,.2)"
                            }`,
                            borderRadius: 6,
                            fontSize: 11,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                          }}>
                            <div>
                              <strong>${analysis.transaction.amount.toFixed(0)}</strong>
                            </div>
                            <span style={{
                              padding: "2px 6px",
                              borderRadius: 4,
                              fontSize: 9,
                              fontWeight: 900,
                              background: analysis.recommendation === "FRAUD" ? "#ff3d5a" :
                                          analysis.recommendation === "REVIEW" ? "#ff9500" :
                                          "#00d084",
                              color: "white"
                            }}>
                              {analysis.recommendation}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ color: "rgba(10,14,26,.5)", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}>
                        Aguardando…
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <HeimdallDrawer 
       context={context} 
       apiBase={API_BASE}
      />
    </div>
  );
}