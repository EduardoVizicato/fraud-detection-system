import { Link } from "react-router-dom";
import "./landing.css";

export default function Landing() {
  return (
    <div className="lp">
      <main id="top">
        <section className="lp-hero">
          <div className="lp-container lp-heroGrid">
            <div className="lp-heroCopy">
              <div className="lp-pill">
                <span className="lp-dot lp-dotOk" />
                Active defense system
              </div>

              <h1 className="lp-h1">
                Detect, explain, and react.
                <span className="lp-h1Accent"> In seconds.</span>
              </h1>

              <p className="lp-subtitle">
                A command center for metrics and charts + an AI copilot to investigate anomalies,
                eliminate false positives, and turn complex data into decisive action.
              </p>

              <div className="lp-heroBtns">
                <a className="lp-btn lp-btnPrimary" href="#cta">Get Started</a>
                <a className="lp-btn lp-btnGhost" href="#capabilities">View Capabilities</a>
              </div>

              <div className="lp-micro">
                <div className="lp-microItem">
                  <span className="lp-badge lp-badgeSafe">#2ecc40</span>
                  <span>Safe / Approved</span>
                </div>
                <div className="lp-microItem">
                  <span className="lp-badge lp-badgeWarn">#ff851b</span>
                  <span>Warning / Triage</span>
                </div>
                <div className="lp-microItem">
                  <span className="lp-badge lp-badgeRisk">#ff4136</span>
                  <span>Fraud / High Risk</span>
                </div>
              </div>
            </div>

            {/* HERO VISUAL */}
            <div className="lp-heroVisual" aria-label="Product preview">
              <div className="lp-glow lp-glowBlue" />
              <div className="lp-glow lp-glowRed" />
              <div className="lp-mock">
                <div className="lp-mockTop">
                  <span className="lp-mockDot" />
                  <span className="lp-mockDot" />
                  <span className="lp-mockDot" />
                  <span className="lp-mockTitle">FraudShield Console</span>
                </div>

                <div className="lp-mockBody">
                  <div className="lp-kpis">
                    <div className="lp-kpi">
                      <div className="lp-kpiLabel">High Risk</div>
                      <div className="lp-kpiValue">
                        17 <span className="lp-kpiUnit">cases</span>
                      </div>
                      <div className="lp-kpiChip lp-chipRisk">ALERT</div>
                    </div>
                    <div className="lp-kpi">
                      <div className="lp-kpiLabel">Precision</div>
                      <div className="lp-kpiValue">
                        0.93 <span className="lp-kpiUnit">score</span>
                      </div>
                      <div className="lp-kpiChip lp-chipInfo">MODEL</div>
                    </div>
                    <div className="lp-kpi">
                      <div className="lp-kpiLabel">Recall</div>
                      <div className="lp-kpiValue">
                        0.88 <span className="lp-kpiUnit">score</span>
                      </div>
                      <div className="lp-kpiChip lp-chipSafe">OK</div>
                    </div>
                  </div>

                  <div className="lp-sparkWrap">
                    <div className="lp-sparkHeader">
                      <div className="lp-sparkTitle">Signals • Charts</div>
                      <div className="lp-sparkHint">anomalies / alerts / approvals</div>
                    </div>
                    <div className="lp-spark">
                      <div className="lp-bar lp-bar1" />
                      <div className="lp-bar lp-bar2" />
                      <div className="lp-bar lp-bar3" />
                      <div className="lp-bar lp-bar4" />
                      <div className="lp-bar lp-bar5" />
                      <div className="lp-bar lp-bar6" />
                      <div className="lp-bar lp-bar7" />
                      <div className="lp-bar lp-bar8" />
                      <div className="lp-bar lp-bar9" />
                      <div className="lp-bar lp-bar10" />
                      <div className="lp-line" />
                    </div>
                  </div>

                  <div className="lp-chatPreview">
                    <div className="lp-chatTop">
                      <div className="lp-chatTitle">Copilot</div>
                      <div className="lp-chatChip">Investigation</div>
                    </div>
                    <div className="lp-bubble lp-bubbleUser">
                      “Why is this transaction flagged as high risk?”
                    </div>
                    <div className="lp-bubble lp-bubbleBot">
                      “Critical Signal: IP mismatch + device fingerprint velocity. Recommend manual review
                      of historical chargebacks before approval.”
                    </div>
                  </div>
                </div>
              </div>

              <div className="lp-miniNote">
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCT */}
        <section id="product" className="lp-section">
          <div className="lp-container">
            <div className="lp-sectionHead">
              <h2 className="lp-h2">Uncompromising Clarity</h2>
              <p className="lp-p">
                Interfaces designed for cognitive ergonomics. Contrast, hierarchy, and speed—so you can
                make decisions without hunting for data.
              </p>
            </div>

            <div className="lp-grid3">
              <FeatureCard
                tone="info"
                title="Analytical Dashboard"
                desc="KPIs, curves, and real-time alerts with a clean layout focused on action."
              />
              <FeatureCard
                tone="warn"
                title="Smart Triage"
                desc="Automatic case prioritization (High/Medium/Watch) with instant filters."
              />
              <FeatureCard
                tone="safe"
                title="Evidence & Explanation"
                desc="Copilot summarizes key signals and prescribes the next investigation steps."
              />
            </div>
          </div>
        </section>

        {/* CAPABILITIES */}
        <section id="capabilities" className="lp-section lp-sectionAlt">
          <div className="lp-container">
            <div className="lp-split">
              <div>
                <h2 className="lp-h2">Engineered to eliminate error fatigue</h2>
                <p className="lp-p">
                  Discover the technology protecting financial institutions worldwide by reducing noise and increasing focus.
                </p>

                <ul className="lp-list">
                  <li>
                    <span className="lp-bullet lp-bulletInfo" /> High-contrast layout, generous spacing, legible typography
                  </li>
                  <li>
                    <span className="lp-bullet lp-bulletRisk" /> Critical alerts visible without cluttering the view
                  </li>
                  <li>
                    <span className="lp-bullet lp-bulletSafe" /> Built for reliability and rapid data ingestion
                  </li>
                </ul>
              </div>

              <div className="lp-callout">
                <div className="lp-calloutTitle">Cognitive Ergonomics</div>
                <div className="lp-calloutBody">
                  <div className="lp-rule">
                    <span className="lp-swatch" style={{ background: "#001f3f" }} />
                    Navy base for trust and eye comfort.
                  </div>
                  <div className="lp-rule">
                    <span className="lp-swatch" style={{ background: "#ff4136" }} />
                    Red reserved exclusively for confirmed risk.
                  </div>
                  <div className="lp-rule">
                    <span className="lp-swatch" style={{ background: "#0074d9" }} />
                    Blue for actionable intelligence.
                  </div>
                  <div className="lp-rule">
                    <span className="lp-swatch" style={{ background: "#2ecc40" }} />
                    Green for verified safety.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SIGNALS */}
        <section id="signals" className="lp-section">
          <div className="lp-container">
            <div className="lp-sectionHead">
              <h2 className="lp-h2">Signals that matter</h2>
              <p className="lp-p">
                Comprehensive telemetry to secure every transaction
              </p>
            </div>

            <div className="lp-grid2">
              <SignalCard
                color="risk"
                title="Confirmed Fraud"
                desc="Pattern anomalies, critical inconsistencies, high probability scores."
              />
              <SignalCard
                color="warn"
                title="Review Required"
                desc="Moderate signals: slight discrepancies or emerging behavioral shifts."
              />
              <SignalCard
                color="info"
                title="Contextual Data"
                desc="Behavioral context: velocity, trends, periods, and deviations."
              />
              <SignalCard
                color="safe"
                title="Verified Safe"
                desc="Transactions consistent with historical patterns and clean signals."
              />
            </div>
          </div>
        </section>

        {/* HOW */}
        <section id="how" className="lp-section lp-sectionAlt">
          <div className="lp-container">
            <div className="lp-sectionHead">
              <h2 className="lp-h2">Operational Workflow</h2>
              <p className="lp-p">A streamlined path from detection to resolution: Query → Evidence → Decision.</p>
            </div>

            <div className="lp-steps">
              <Step n="01" title="Monitor" desc="Dashboard highlights KPIs, trends, and alerts with high contrast." />
              <Step n="02" title="Investigate" desc="Ask Copilot for root-cause analysis and investigation paths." />
              <Step n="03" title="Validate" desc="Compare metrics and review specific signals using quick filters." />
              <Step n="04" title="Resolve" desc="Tag, report, and feed the decision back into the model." />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="lp-cta">
          <div className="lp-container lp-ctaBox">
            <div>
              <h3 className="lp-h3">Experience the future of fraud detection</h3>
              <p className="lp-p">
                Deploy your ultimate defense agent today.
              </p>
            </div>
            <div className="lp-ctaBtns">
              <Link className="lp-btn lp-btnGhost" to="/login">Log in</Link>
              <Link className="lp-btn lp-btnPrimary" to="/signUp">Sign up</Link>
            </div>
          </div>
        </section>

        <footer className="lp-footer">
          <div className="lp-container lp-footerInner">
            <span>© {new Date().getFullYear()} FraudShield • Copilot AI</span>
            <span className="lp-footerRight">Enterprise Edition • FraudShield Technologies</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

function FeatureCard({ title, desc, tone }: { title: string; desc: string; tone: "info" | "warn" | "safe" }) {
  return (
    <div className={`lp-card lp-card-${tone}`}>
      <div className={`lp-cardIcon lp-icon-${tone}`} />
      <div className="lp-cardTitle">{title}</div>
      <div className="lp-cardDesc">{desc}</div>
    </div>
  );
}

function SignalCard({ title, desc, color }: { title: string; desc: string; color: "risk" | "warn" | "info" | "safe" }) {
  return (
    <div className="lp-signal">
      <div className={`lp-signalBar lp-${color}`} />
      <div className="lp-signalBody">
        <div className="lp-signalTitle">{title}</div>
        <div className="lp-signalDesc">{desc}</div>
      </div>
    </div>
  );
}

function Step({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <div className="lp-step">
      <div className="lp-stepN">{n}</div>
      <div className="lp-stepTitle">{title}</div>
      <div className="lp-stepDesc">{desc}</div>
    </div>
  );
}