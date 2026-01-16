# Relatório de Auditoria — Detecção de Fraudes

## KPIs
- Total de casos (teste): **71202**
- Fraudes reais (classe 1): **123**
- Alertas gerados (pred=1): **91**
- TP: **76** | FP: **47** | FN: **15** | TN: **71064**
- Precision: **0.618**
- Recall: **0.835**

## Interpretação
- Precision alta significa menos falsos positivos (menos clientes legítimos bloqueados).
- Recall alto significa menos fraudes passando despercebidas.
- Em fraude, normalmente buscamos maximizar recall mantendo precision operacionalmente aceitável.

## Top 10 alertas (maior probabilidade de fraude)
|   fraud_probability |   y_true |   y_pred | outcome   |
|--------------------:|---------:|---------:|:----------|
|                   1 |        1 |        1 | TP        |
|                   1 |        1 |        1 | TP        |
|                   1 |        1 |        1 | TP        |
|                   1 |        1 |        1 | TP        |
|                   1 |        1 |        1 | TP        |
|                   1 |        1 |        1 | TP        |
|                   1 |        1 |        1 | TP        |
|                   1 |        1 |        1 | TP        |
|                   1 |        1 |        1 | TP        |
|                   1 |        1 |        1 | TP        |