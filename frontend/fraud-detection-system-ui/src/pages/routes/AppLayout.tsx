import { Outlet, NavLink, useNavigate } from "react-router";
import { getUserName, logOut } from "../auth/validation/auth";

export default function AppLayout() {
  const nav = useNavigate();
  const name = getUserName() || "Usuário";

  function onLogout() {
    logOut();
    nav("/");
  }

  return (
    <div>
      <header className="topbar">
        <div className="container topbar-inner">
          <div className="brand">
            <div className="brand-mark" />
            <div>
              <div className="brand-title">FraudShield</div>
              <div className="brand-sub">Logado como {name}</div>
            </div>
          </div>

          <nav className="lp-links" aria-label="App">
            <NavLink to="/app/heimdall">Heimdall</NavLink>
            <NavLink to="/app/dashboard">Dashboard</NavLink>
          </nav>

          <button className="btn btn-ghost" onClick={onLogout}>Sair</button>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
