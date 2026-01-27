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
                Defesa ativa contra fraude
              </div>

              <h1 className="lp-h1">
                Detecte, explique e reaja.
                <span className="lp-h1Accent"> Em segundos.</span>
              </h1>

              <p className="lp-subtitle">
                Um painel moderno para métricas e gráficos + um copiloto (Heimdall) para investigar casos,
                reduzir falsos positivos e transformar dados em decisão.
              </p>

              <div className="lp-heroBtns">
                <a className="lp-btn lp-btnPrimary" href="#cta">Começar agora</a>
                <a className="lp-btn lp-btnGhost" href="#capabilities">Ver capacidades</a>
              </div>

              <div className="lp-micro">
                <div className="lp-microItem">
                  <span className="lp-badge lp-badgeSafe">#2ecc40</span>
                  <span>Seguro / aprovado</span>
                </div>
                <div className="lp-microItem">
                  <span className="lp-badge lp-badgeWarn">#ff851b</span>
                  <span>Alertas / triagem</span>
                </div>
                <div className="lp-microItem">
                  <span className="lp-badge lp-badgeRisk">#ff4136</span>
                  <span>Fraude / alto risco</span>
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
                      <div className="lp-kpiLabel">Risco alto</div>
                      <div className="lp-kpiValue">
                        17 <span className="lp-kpiUnit">cases</span>
                      </div>
                      <div className="lp-kpiChip lp-chipRisk">ALERTA</div>
                    </div>
                    <div className="lp-kpi">
                      <div className="lp-kpiLabel">Precisão</div>
                      <div className="lp-kpiValue">
                        0.93 <span className="lp-kpiUnit">score</span>
                      </div>
                      <div className="lp-kpiChip lp-chipInfo">MODELO</div>
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
                      <div className="lp-sparkTitle">Sinais • Últimas 24h</div>
                      <div className="lp-sparkHint">anomalias / alertas / aprovações</div>
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
                      <div className="lp-chatTitle">Heimdall</div>
                      <div className="lp-chatChip">Investigação</div>
                    </div>
                    <div className="lp-bubble lp-bubbleUser">
                      “Por que esse pagamento foi marcado como alto risco?”
                    </div>
                    <div className="lp-bubble lp-bubbleBot">
                      “Sinal forte: padrão de IP incomum + divergência de device fingerprint. Sugiro revisar
                      histórico e aplicar verificação adicional.”
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
              <h2 className="lp-h2">Uma visão clara do risco</h2>
              <p className="lp-p">
                Gráficos e relatórios que priorizam contraste, hierarquia visual e velocidade de leitura —
                para tomar decisão sem “caçar informação”.
              </p>
            </div>

            <div className="lp-grid3">
              <FeatureCard
                tone="info"
                title="Dashboard analítico"
                desc="KPIs, curvas, alertas e comparativos com layout limpo e foco em ação."
              />
              <FeatureCard
                tone="warn"
                title="Triagem inteligente"
                desc="Destaque de casos por nível de risco (alto/médio/atenção) com filtros rápidos."
              />
              <FeatureCard
                tone="safe"
                title="Evidência e explicação"
                desc="Heimdall resume sinais principais e sugere próximos passos para investigação."
              />
            </div>
          </div>
        </section>

        {/* CAPABILITIES */}
        <section id="capabilities" className="lp-section lp-sectionAlt">
          <div className="lp-container">
            <div className="lp-split">
              <div>
                <h2 className="lp-h2">Feito para apresentação e produção</h2>
                <p className="lp-p">
                  A landing é só a porta de entrada. Depois, o app vira um console completo: chat com UX
                  decente, gráficos consistentes e reports bonitos.
                </p>

                <ul className="lp-list">
                  <li>
                    <span className="lp-bullet lp-bulletInfo" /> Layout moderno, espaçamento generoso, tipografia forte
                  </li>
                  <li>
                    <span className="lp-bullet lp-bulletRisk" /> Alertas visíveis sem poluir o painel
                  </li>
                  <li>
                    <span className="lp-bullet lp-bulletSafe" /> Foco em confiabilidade e leitura rápida
                  </li>
                </ul>
              </div>

              <div className="lp-callout">
                <div className="lp-calloutTitle">Design rules (seu briefing)</div>
                <div className="lp-calloutBody">
                  <div className="lp-rule">
                    <span className="lp-swatch" style={{ background: "#001f3f" }} />
                    Azul navy como base (confiança/defesa).
                  </div>
                  <div className="lp-rule">
                    <span className="lp-swatch" style={{ background: "#ff4136" }} />
                    Vermelho só para risco/fraude real.
                  </div>
                  <div className="lp-rule">
                    <span className="lp-swatch" style={{ background: "#0074d9" }} />
                    Azul claro para interação e info.
                  </div>
                  <div className="lp-rule">
                    <span className="lp-swatch" style={{ background: "#2ecc40" }} />
                    Verde para “safe / sucesso”.
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
              <h2 className="lp-h2">Sinais que importam</h2>
              <p className="lp-p">
                Use cores saturadas apenas quando for urgente. O resto fica calmo e legível.
              </p>
            </div>

            <div className="lp-grid2">
              <SignalCard
                color="risk"
                title="Fraude detectada"
                desc="Transações fora do padrão, inconsistências críticas, alta probabilidade."
              />
              <SignalCard
                color="warn"
                title="Atenção / revisão"
                desc="Sinais moderados: discrepâncias pequenas, padrões emergentes."
              />
              <SignalCard
                color="info"
                title="Informação"
                desc="Contexto do comportamento: volume, tendência, períodos e variações."
              />
              <SignalCard
                color="safe"
                title="Seguro"
                desc="Transações consistentes com histórico e sinais limpos."
              />
            </div>
          </div>
        </section>

        {/* HOW */}
        <section id="how" className="lp-section lp-sectionAlt">
          <div className="lp-container">
            <div className="lp-sectionHead">
              <h2 className="lp-h2">Como você vai usar</h2>
              <p className="lp-p">Fluxo simples para demo: pergunta → evidência → decisão → ação.</p>
            </div>

            <div className="lp-steps">
              <Step n="01" title="Abra o painel" desc="KPIs + tendências + alertas, tudo com contraste alto." />
              <Step n="02" title="Pergunte ao Heimdall" desc="Explique o caso e peça sugestões de investigação." />
              <Step n="03" title="Valide com dados" desc="Compare métricas e revise sinais com filtros rápidos." />
              <Step n="04" title="Aja" desc="Marque, reporte e acompanhe o que mudou no comportamento." />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="lp-cta">
          <div className="lp-container lp-ctaBox">
            <div>
              <h3 className="lp-h3">Venha conhecer o futuro da detecção de fraudes</h3>
              <p className="lp-p">
                Conheça o seu ultimo agente de detecção de fraudes!
              </p>
            </div>
            <div className="lp-ctaBtns">
              <a className="lp-btn lp-btnPrimary" href="#">Abrir chat</a>
              <a className="lp-btn lp-btnGhost" href="#top">Voltar ao topo</a>
            </div>
          </div>
        </section>

        <footer className="lp-footer">
          <div className="lp-container lp-footerInner">
            <span>© {new Date().getFullYear()} FraudShield • Heimdall</span>
            <span className="lp-footerRight">Made for demo • Eduardo Vizicato</span>
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
