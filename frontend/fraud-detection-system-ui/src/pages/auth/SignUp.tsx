import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { signUp } from "../auth/validation/auth";
import "./auth.css";

export default function SignUp() {
  const nav = useNavigate();
  const [name, setName] = useState("Eduardo");
  const [email, setEmail] = useState("eduardo@fraudshield.com");
  const [password, setPassword] = useState("edu123");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      if (password.length < 4) throw new Error("Senha muito curta (mínimo 4).");
      signUp({ name: name.trim(), email: email.trim(), password });
      nav("/dashboard");
    } catch (e: any) {
      setErr(e?.message ?? "Erro ao cadastrar.");
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
            <div className="auth-sub">Criar conta (demo)</div>
          </div>
        </div>

        <h1 className="auth-h1">Sign up</h1>
        <p className="auth-p">Tudo local (sem banco). Perfeito pra apresentação.</p>

        {err && <div className="auth-alert">{err}</div>}

        <form onSubmit={onSubmit} className="auth-form">
          <label className="auth-label">
            Nome
            <input className="auth-input" value={name} onChange={(e) => setName(e.target.value)} />
          </label>

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
            {loading ? "Criando..." : "Criar conta"}
          </button>

          <div className="auth-row">
            <span className="auth-muted">Já tem conta?</span>
            <Link className="auth-link" to="/login">Entrar</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
