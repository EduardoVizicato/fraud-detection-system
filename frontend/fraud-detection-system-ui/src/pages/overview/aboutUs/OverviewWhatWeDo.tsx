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
              FraudShield • vision, evidence, and action
            </div>

            <h1 className="ow-h1">
              What we do:
              <span className="ow-accent"> we reduce fraud</span> without increasing noise.
            </h1>

            <p className="ow-lead">
              We combine data analysis + metrics + copilot (Heimdall) to detect suspicious behavior,
              explain the “why” of the risk, and guide the next action — focusing on high readability and quick decision-making.
            </p>

            <div className="ow-cta">
              <Link className="lp-btn lp-btnPrimary" to="/signUp">Sign up</Link>
              <Link className="lp-btn lp-btnGhost" to="/overview/heimdall">View Heimdall</Link>
              <Link className="lp-btn lp-btnGhost" to="/overview/dashboard">View Dashboard</Link>
            </div>

            <div className="ow-metrics">
              <Metric label="Base" value="Navy" tone="info" sub="trust/defense" />
              <Metric label="Alert" value="Orange" tone="warn" sub="triage" />
              <Metric label="Risk" value="Red" tone="risk" sub="fraud" />
              <Metric label="OK" value="Green" tone="safe" sub="safe" />
            </div>
          </div>

          {/* RIGHT: “mini manifesto / principles” */}
          <div className="ow-right">
            <div className="ow-panel">
              <div className="ow-panelTop">
                <div className="ow-panelTitle">Design principles</div>
                <div className="ow-panelHint">Your briefing, applied to the product</div>
              </div>

              <div className="ow-panelBody">
                <Rule
                  title="Saturation only when it matters"
                  desc="Red/orange appear only for urgent signals (fraud/alert)."
                  tone="risk"
                />
                <Rule
                  title="High contrast for quick reading"
                  desc="KPIs and charts with visual hierarchy and whitespace."
                  tone="info"
                />
                <Rule
                  title="Trust as a base"
                  desc="Navy as main color: sense of safety and control."
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
            <h2 className="ow-h2">What the system delivers</h2>
            <p className="ow-p">
              Three pillars: detect, explain, and act — connecting data, metrics, and investigation.
            </p>
          </div>

          <div className="ow-grid3">
            <Card
              tone="risk"
              title="Fraud detection"
              desc="Identifies anomalous patterns and cases with high fraud probability."
            />
            <Card
              tone="info"
              title="Metrics and charts"
              desc="KPIs, comparisons, and trends to validate decisions with evidence."
            />
            <Card
              tone="safe"
              title="Heimdall (copilot)"
              desc="Explains why a case rose to risk and suggests next triage steps."
            />
          </div>
        </section>

        {/* HOW IT WORKS: pipeline */}
        <section className="ow-section">
          <div className="ow-head">
            <h2 className="ow-h2">How it works</h2>
            <p className="ow-p">
              Flow designed for demo: from raw data to clear action (no “hunting for information”).
            </p>
          </div>

          <div className="ow-pipeline">
            <Step n="01" title="Ingestion & prep" desc="Transaction data → cleaning → features." tone="info" />
            <Step n="02" title="Score & rules" desc="Model + heuristics → risk per transaction." tone="warn" />
            <Step n="03" title="Visual evidence" desc="KPIs + charts to validate patterns." tone="info" />
            <Step n="04" title="Investigation (Heimdall)" desc="Case explanation + action checklist." tone="safe" />
            <Step n="05" title="Decision" desc="Approve, review, or block, with traceability." tone="risk" />
          </div>
        </section>

        {/* WHY THIS MATTERS */}
        <section className="ow-section ow-split">
          <div className="ow-box">
            <h3 className="ow-h3">Why this matters</h3>
            <p className="ow-p">
              Fraud is dynamic. A good system doesn't just detect — it helps understand,
              reduce false positives, and accelerate investigation.
            </p>

            <ul className="ow-list">
              <li><span className="ow-bullet info" /> Quick response with evidence</li>
              <li><span className="ow-bullet warn" /> Triage prioritized by risk</li>
              <li><span className="ow-bullet safe" /> Less noise (false positives)</li>
              <li><span className="ow-bullet risk" /> Clear action for actual fraud</li>
            </ul>
          </div>

          <div className="ow-box">
            <h3 className="ow-h3">What you show in the presentation</h3>
            <p className="ow-p">
              A simple and strong narrative:
            </p>

            <div className="ow-narrative">
              <div className="ow-nItem">
                <div className="ow-nTitle">Problem</div>
                <div className="ow-nDesc">Fraud grows and teams waste time with noise.</div>
              </div>
              <div className="ow-nItem">
                <div className="ow-nTitle">Solution</div>
                <div className="ow-nDesc">Dashboard + Heimdall to explain and act.</div>
              </div>
              <div className="ow-nItem">
                <div className="ow-nTitle">Result</div>
                <div className="ow-nDesc">Faster decision, with evidence and readability.</div>
              </div>
            </div>

            <div className="ow-cta2">
              <Link className="lp-btn lp-btnGhost" to="/login">Log in</Link>
              <Link className="lp-btn lp-btnPrimary" to="/signUp">Sign up</Link>
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