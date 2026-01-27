import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { login } from "../auth/validation/auth";
import "./auth.css";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("eduardo@fraudshield.com");
  const [password, setPassword] = useState("edu123");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      login(email.trim(), password);
      nav("/dashboard");
    } catch (e: any) {
      setErr(e?.message ?? "Erro ao entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-mark" />
          <div>
            <div className="auth-title">FraudShield</div>
            <div className="auth-sub">Acesso à demo</div>
          </div>
        </div>

        <h1 className="auth-h1">Entrar</h1>
        <p className="auth-p">Use a conta demo ou crie uma nova.</p>

        {err && <div className="auth-alert">{err}</div>}

        <form onSubmit={onSubmit} className="auth-form">
          <label className="auth-label">
            Email
            <input className="auth-input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>

          <label className="auth-label">
            Senha
            <input
              className="auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button className="auth-btn auth-btnPrimary" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <div className="auth-row">
            <span className="auth-muted">Não tem conta?</span>
            <Link className="auth-link" to="/signup">Criar conta</Link>
          </div>

          <div className="auth-mini">
            <span className="auth-dot auth-dotInfo" />
          </div>
        </form>
      </div>
    </div>
  );
}
