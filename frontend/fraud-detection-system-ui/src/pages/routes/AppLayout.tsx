import { Outlet, useNavigate, Link } from "react-router";
import { logOut } from "../auth/validation/auth";

export default function AppLayout() {
  const nav = useNavigate();

  function onLogout() {
    logOut();
    nav("/");
  }

  return (
    <div>
      <header className="topbar">
        <div className="container topbar-inner">
            <Link className="lp-brand" to="/app/dashboard" aria-label="FraudShield Home">
                <span className="lp-logo" aria-hidden />
                <span className="lp-brandText">
                    <span className="lp-brandName">FraudShield</span>
                    <span className="lp-brandTag">Heimdall • Fraud Detection</span>
                </span>
            </Link>

          <nav className="lp-links" aria-label="App">
          </nav>

          <button className="lp-btn lp-btnGhost" onClick={onLogout}>Sair</button>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
