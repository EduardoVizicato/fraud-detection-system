# Relatório final - Detecção de fraudes

## Conclusão
- Comparando Baseline vs Balanced, há um trade-off claro entre recall e precision na classe fraude.
- O modelo Balanced aumenta significativamente o recall, mas tende a gerar muitos falsos positivos.
- O threshold tuning foi aplicado para buscar um ponto de equilíbrio mais operacional.

## Resultados (Classe Fraude)
- **Baseline**: precision=0.829, recall=0.643, f1=0.724, support=98
- **Balanced**: precision=0.061, recall=0.918, f1=0.114, support=98

## Artefatos gerados
- `data/processed/final_summary.csv`
- `data/processed/figures/precision_recall_fraude.png`
- `data/processed/ai_conclusions.md` (interpretação via IA)
