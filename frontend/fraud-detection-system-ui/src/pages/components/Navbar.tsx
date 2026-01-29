import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
      <header className="lp-header">
        <div className="lp-container lp-nav">
            <Link className="lp-brand" to="/" aria-label="FraudShield Home">
                <span className="lp-logo" aria-hidden />
                <span className="lp-brandText">
                    <span className="lp-brandName">FraudShield</span>
                    <span className="lp-brandTag">Heimdall • Fraud Detection</span>
                </span>
            </Link>

          <nav className="lp-links" aria-label="Primary">
            <NavLink to="/overview/heimdall">Heimdall</NavLink>
            <NavLink to="/overview/dashboard">Dashboard</NavLink>
            <NavLink to="/overview/o-que-fazemos">What we do?</NavLink>
          </nav>

          <div className="lp-actions">
            <Link className="lp-btn lp-btnGhost" to="/login">Log in</Link>
            <Link className="lp-btn lp-btnPrimary" to="/signUp">Sign up</Link>
          </div>
        </div>
      </header>
  );
}
