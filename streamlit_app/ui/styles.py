import streamlit as stream

# Adicionei as regras de ocultação no final do bloco <style>
CSS = """
<style>
:root{
  /* 2026 palette */
  --offblack: #0B1220;
  --slate: #0F1B2A;
  --line: rgba(230,241,255,.10);

  --royal: #1D4ED8;     /* Royal/Pure Blue */
  --pure:  #2563EB;     /* Azul puro alternativo */
  --teal:  #2F6364;     /* Transformative Teal */
  --teal2: #0E2F30;     /* teal dark p/ blocos */
  --text:  #E6F1FF;
  --muted: rgba(230,241,255,.72);

  --r: 16px;            /* radius */
}

html, body, [data-testid="stAppViewContainer"]{
  background: radial-gradient(1200px 700px at 20% 0%, rgba(47,99,100,.22), transparent 55%),
              radial-gradient(900px 600px at 85% 10%, rgba(29,78,216,.18), transparent 60%),
              var(--offblack) !important;
  color: var(--text) !important;
}

/* Ajuste de padding para aproveitar o espaço sem a barra superior */
.block-container{ padding-top: 1.5rem; padding-bottom: 2.0rem; }

.card{
  background: linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.01));
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 16px;
}

.badge{
  display:inline-flex; align-items:center; gap:8px;
  padding: 6px 10px; border-radius: 999px;
  border: 1px solid var(--line);
  background: rgba(255,255,255,.03);
  color: var(--muted);
  font-size: .88rem;
}

a, a:visited{ color: #8AB4FF; }
hr{ opacity: .25; }

.stButton>button{
  border-radius: 12px;
  border: 1px solid var(--line);
}

.stButton>button[kind="primary"]{
  background: linear-gradient(90deg, var(--royal), var(--pure)) !important;
  border: none !important;
  color: white !important;
}

/* --- AQUI ESTÃO AS REGRAS PARA SUMIR COM AS BARRAS --- */

/* Remove a barra superior (header) */
header[data-testid="stHeader"] {
    display: none !important;
}

/* Remove a sidebar */
section[data-testid="stSidebar"] {
    display: none !important;
}

/* Remove o botão de expandir/contrair sidebar que as vezes sobra no canto */
div[data-testid="collapsedControl"] {
    display: none !important;
}

/* Remove botões de menu da imagem */
button[title="View fullscreen"]{
    visibility: hidden;
}

</style>
"""

def inject_css():
    stream.markdown(CSS, unsafe_allow_html=True)