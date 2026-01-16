# Conclusões da IA sobre os models

Como cientista de dados, aqui está a análise técnica dos resultados:

### 1) Explicação do Desempenho
   **Baseline:** É um modelo "conservador". Possui alta **Precision (83%)**, o que significa que quando ele aponta fraude, ele geralmente está certo. Porém, tem um **Recall baixo (64%)**, deixando passar 36% das fraudes reais (falsos negativos).
   **Balanced:** É um modelo "agressivo". Prioriza o **Recall (92%)**, detectando quase todas as fraudes. Contudo, sua **Precision é baixíssima (6%)**, o que significa que para cada 100 alertas gerados, apenas 6 são fraudes reais e 94 são alarmes falsos.

### 2) Modelo Recomendado
   **Recomendação:** O modelo **Balanced** (com ressalvas operacionais).
   **Por que?** Em detecção de fraude, o custo financeiro de uma fraude não detectada (falso negativo) costuma ser muito superior ao custo de revisar uma transação legítima. O modelo Balanced garante que o prejuízo financeiro direto seja minimizado ao capturar 92% dos casos.

### 3) Riscos e Trade-offs
   **Sobrecarga Operacional:** O modelo Balanced exigirá uma equipe de investigação muito grande para filtrar o enorme volume de alarmes falsos.
   **Atrito com o Cliente:** Bloqueios indevidos de cartões ou contas legítimas geram insatisfação e podem causar o abandono do produto (churn).
   **Fadiga de Alerta:** Analistas humanos podem começar a ignorar os alertas por acharem que o sistema "sempre erra".

### 4) Sugestões de Melhoria
   **Ajuste de Threshold (Limiar):** Não usar o padrão de 0.5. Deve-se plotar a curva Precision-Recall e encontrar um ponto de equilíbrio onde o Recall permaneça alto (ex: >80%), mas a Precision suba para um nível aceitável (ex: >30%).
   **Feature Engineering:** Criar variáveis de comportamento (ex: distância da última compra, velocidade de gasto, perfil de estabelecimento) para ajudar o modelo a distinguir melhor o que é um comportamento atípico de uma fraude real.