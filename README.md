# Detecção de Fraudes em Transações Financeiras (Regras + ML + IA)

Projeto de portfólio para detectar fraudes de cartão de crédito usando:
- **Machine Learning (Sklearn)** para classificação (Baseline vs Balanced)
- **Análise comparativa** com métricas (precision/recall/F1 e confusion matrix)
- **IA (LLM)** para interpretar resultados e gerar um relatório em linguagem natural
- **Ajuste de threshold** via curva Precision-Recall para melhorar trade-offs

---

## Objetivo

Construir um pipeline simples e reproduzível para:
1. Ler e explorar um dataset público de transações
2. Treinar um modelo baseline e um modelo balanceado
3. Comparar desempenho focando na classe **fraude**
4. Usar IA para gerar uma análise automática dos resultados (Dia 10)
5. Ajustar o limiar (threshold) para encontrar equilíbrio entre **recall** e **precision** (Dia 11)

---

## Dataset

- **Fonte:** Kaggle Credit Card Fraud Detection

---

## Arquitetura do Projeto (visão rápida)

**Dados → Treino (Baseline/Balanced) → Métricas → Comparação → IA interpreta → Threshold tuning**

- **Baseline:** mais conservador (melhor precisão na fraude, menor recall)
- **Balanced:** mais agressivo (maior recall na fraude, mas pode gerar muitos falsos positivos)
- **Threshold tuning:** ajusta o limiar para tentar melhorar precisão sem perder recall demais

---

## Resultados (métricas principais)

### Classe Fraude (classe 1) — Teste
> Esses valores vêm do `classification_report` no conjunto de teste.

- **Baseline**
  - Precision: **0.8289**
  - Recall: **0.6429**
  - F1-score: **0.7241**
  - Support: **98**

- **Balanced**
  - Precision: **0.0608**
  - Recall: **0.9184**
  - F1-score: **0.1141**
  - Support: **98**

**Interpretação rápida:**
- O **Baseline** acerta mais quando diz “fraude” (alta precision), mas perde uma parte relevante das fraudes (recall menor).
- O **Balanced** captura quase todas as fraudes (recall alto), mas gera muitos alarmes falsos (precision muito baixa).

---

## Como Rodar (Windows)

### 1) Criar e ativar venv
```bash
python -m venv venv
venv\Scripts\activate
```

### 2) Instalar dependências
```bash
pip install -r requirements.txt
```


### Tecnologias
- Python
- Pandas / NumPy
- Scikit-learn
- Matplotlib
- LangChain (integração LLM)
- dotenv (.env)
