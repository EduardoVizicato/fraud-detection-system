import "./overviewWhatWeDo.css";
import { Link } from "react-router-dom";

export default function OverviewWhatWeDo() {
  return (
    <div className="ov ow">
      <div className="lp-container">
        {/* HERO */}
        <section className="ow-hero">
          <div className="ow-left">
            <div className="ov-pill">
              <span className="ov-dot ov-dotSafe" />
              FraudShield • visão, evidência e ação
            </div>

            <h1 className="ow-h1">
              O que fazemos:
              <span className="ow-accent"> reduzimos fraude</span> sem aumentar ruído.
            </h1>

            <p className="ow-lead">
              Unimos análise de dados + métricas + copiloto (Heimdall) para detectar comportamento suspeito,
              explicar o “porquê” do risco e orientar a próxima ação — com foco em alta legibilidade e decisão rápida.
            </p>

            <div className="ow-cta">
              <Link className="lp-btn lp-btnPrimary" to="/login">Entrar na demo</Link>
              <Link className="lp-btn lp-btnGhost" to="/overview/heimdall">Ver Heimdall</Link>
              <Link className="lp-btn lp-btnGhost" to="/overview/dashboard">Ver Dashboard</Link>
            </div>

            <div className="ow-metrics">
              <Metric label="Base" value="Navy" tone="info" sub="confiança/defesa" />
              <Metric label="Alerta" value="Laranja" tone="warn" sub="triagem" />
              <Metric label="Risco" value="Vermelho" tone="risk" sub="fraude" />
              <Metric label="OK" value="Verde" tone="safe" sub="seguro" />
            </div>
          </div>

          {/* RIGHT: “mini manifesto / principles” */}
          <div className="ow-right">
            <div className="ow-panel">
              <div className="ow-panelTop">
                <div className="ow-panelTitle">Princípios de design</div>
                <div className="ow-panelHint">Seu briefing, aplicado no produto</div>
              </div>

              <div className="ow-panelBody">
                <Rule
                  title="Saturação só quando importa"
                  desc="Vermelho/laranja aparecem apenas para sinal urgente (fraude/alerta)."
                  tone="risk"
                />
                <Rule
                  title="Contraste alto para leitura rápida"
                  desc="KPIs e gráficos com hierarquia visual e espaço em branco."
                  tone="info"
                />
                <Rule
                  title="Confiança como base"
                  desc="Navy como cor principal: sensação de segurança e controle."
                  tone="safe"
                />
              </div>
            </div>

            <div className="ow-miniNote">
            </div>
          </div>
        </section>

        {/* WHAT WE DO: cards */}
        <section className="ow-section">
          <div className="ow-head">
            <h2 className="ow-h2">O que o sistema entrega</h2>
            <p className="ow-p">
              Três pilares: detectar, explicar e agir — conectando dados, métricas e investigação.
            </p>
          </div>

          <div className="ow-grid3">
            <Card
              tone="risk"
              title="Detecção de fraude"
              desc="Identifica padrões anômalos e casos com probabilidade elevada de fraude."
            />
            <Card
              tone="info"
              title="Métricas e gráficos"
              desc="KPIs, comparativos e tendências para validar decisões com evidência."
            />
            <Card
              tone="safe"
              title="Heimdall (copiloto)"
              desc="Explica por que um caso subiu para risco e sugere próximos passos de triagem."
            />
          </div>
        </section>

        {/* HOW IT WORKS: pipeline */}
        <section className="ow-section">
          <div className="ow-head">
            <h2 className="ow-h2">Como funciona</h2>
            <p className="ow-p">
              Fluxo pensado para demo: do dado bruto até uma ação clara (sem “caçar informação”).
            </p>
          </div>

          <div className="ow-pipeline">
            <Step n="01" title="Ingestão & preparo" desc="Dados de transação → limpeza → features." tone="info" />
            <Step n="02" title="Score & regras" desc="Modelo + heurísticas → risco por transação." tone="warn" />
            <Step n="03" title="Evidência visual" desc="KPIs + gráficos para validar padrões." tone="info" />
            <Step n="04" title="Investigação (Heimdall)" desc="Explicação do caso + checklist de ação." tone="safe" />
            <Step n="05" title="Decisão" desc="Aprovar, revisar ou bloquear, com rastreabilidade." tone="risk" />
          </div>
        </section>

        {/* WHY THIS MATTERS */}
        <section className="ow-section ow-split">
          <div className="ow-box">
            <h3 className="ow-h3">Por que isso importa</h3>
            <p className="ow-p">
              Fraude é dinâmica. Um bom sistema não só detecta — ele ajuda a entender,
              reduzir falsos positivos e acelerar investigação.
            </p>

            <ul className="ow-list">
              <li><span className="ow-bullet info" /> Resposta rápida com evidência</li>
              <li><span className="ow-bullet warn" /> Triagem priorizada por risco</li>
              <li><span className="ow-bullet safe" /> Menos ruído (falsos positivos)</li>
              <li><span className="ow-bullet risk" /> Ação clara para fraude real</li>
            </ul>
          </div>

          <div className="ow-box">
            <h3 className="ow-h3">O que você mostra na apresentação</h3>
            <p className="ow-p">
              Uma narrativa simples e forte:
            </p>

            <div className="ow-narrative">
              <div className="ow-nItem">
                <div className="ow-nTitle">Problema</div>
                <div className="ow-nDesc">Fraude cresce e os times perdem tempo com ruído.</div>
              </div>
              <div className="ow-nItem">
                <div className="ow-nTitle">Solução</div>
                <div className="ow-nDesc">Dashboard + Heimdall para explicar e agir.</div>
              </div>
              <div className="ow-nItem">
                <div className="ow-nTitle">Resultado</div>
                <div className="ow-nDesc">Decisão mais rápida, com evidência e legibilidade.</div>
              </div>
            </div>

            <div className="ow-cta2">
              <Link className="lp-btn lp-btnPrimary" to="/login">Entrar</Link>
            </div>
          </div>
        </section>

        <footer className="ow-footer">
          <div className="ow-footerLine" />
          <div className="ow-footerText">FraudShield • Overview • Stark mode</div>
        </footer>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  tone: "info" | "warn" | "risk" | "safe";
}) {
  return (
    <div className="ow-metric">
      <div className="ow-mLabel">{label}</div>
      <div className={`ow-mValue tone-${tone}`}>{value}</div>
      <div className="ow-mSub">{sub}</div>
    </div>
  );
}

function Card({
  title,
  desc,
  tone,
}: {
  title: string;
  desc: string;
  tone: "info" | "warn" | "risk" | "safe";
}) {
  return (
    <div className="ow-card">
      <div className={`ow-icon tone-${tone}`} />
      <div className="ow-cardTitle">{title}</div>
      <div className="ow-cardDesc">{desc}</div>
    </div>
  );
}

function Step({
  n,
  title,
  desc,
  tone,
}: {
  n: string;
  title: string;
  desc: string;
  tone: "info" | "warn" | "risk" | "safe";
}) {
  return (
    <div className="ow-step">
      <div className="ow-stepTop">
        <div className="ow-stepN">{n}</div>
        <div className={`ow-stepDot tone-${tone}`} />
      </div>
      <div className="ow-stepTitle">{title}</div>
      <div className="ow-stepDesc">{desc}</div>
    </div>
  );
}

function Rule({
  title,
  desc,
  tone,
}: {
  title: string;
  desc: string;
  tone: "info" | "warn" | "risk" | "safe";
}) {
  return (
    <div className="ow-rule">
      <div className={`ow-ruleDot tone-${tone}`} />
      <div>
        <div className="ow-ruleTitle">{title}</div>
        <div className="ow-ruleDesc">{desc}</div>
      </div>
    </div>
  );
}
