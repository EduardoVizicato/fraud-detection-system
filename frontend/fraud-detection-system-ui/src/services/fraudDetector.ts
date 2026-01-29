/**
 * Fraud Detection Engine - Frontend
 * Usa heurísticas estatísticas SEM modelo ML treinado
 */

export type Transaction = {
  id: string;
  idx: number;
  time: number;
  amount: number;
  features: number[]; // V1-V28
  class: number; // Label real (0=legit, 1=fraud) - só para validação
};

export type UserHistory = {
  transactions: Transaction[];
  stats: {
    avgAmount: number;
    stdAmount: number;
    minAmount: number;
    maxAmount: number;
    avgTime: number;
  };
  featureStats: {
    means: number[];
    stds: number[];
  };
};

export type FraudSignals = {
  amountAnomaly: number; // 0-1 score
  featureDistance: number; // 0-1 score
  velocityAnomaly: number; // 0-1 score
  timeAnomaly: number; // 0-1 score
};

export type AnalysisResult = {
  transaction: Transaction;
  signals: FraudSignals;
  anomalyScore: number; // 0-1, média ponderada
  recommendation: "SAFE" | "REVIEW" | "FRAUD";
  explanation: string;
};

// Estado global do histórico
let userHistory: UserHistory = {
  transactions: [],
  stats: {
    avgAmount: 0,
    stdAmount: 0,
    minAmount: 0,
    maxAmount: 0,
    avgTime: 0,
  },
  featureStats: {
    means: new Array(28).fill(0),
    stds: new Array(28).fill(0),
  },
};

/**
 * Inicializa com seed data (histórico anterior do usuário)
 * Pode vir de localStorage ou backend
 */
export function initializeHistory(seedTransactions: Transaction[]) {
  userHistory.transactions = [...seedTransactions];
  recalculateStats();
}

/**
 * Recalcula estatísticas do histórico
 */
function recalculateStats() {
  if (userHistory.transactions.length === 0) return;

  const amounts = userHistory.transactions.map((t) => t.amount);
  const times = userHistory.transactions.map((t) => t.time);

  // Amount stats
  userHistory.stats.avgAmount =
    amounts.reduce((a, b) => a + b, 0) / amounts.length;
  userHistory.stats.minAmount = Math.min(...amounts);
  userHistory.stats.maxAmount = Math.max(...amounts);
  userHistory.stats.stdAmount = calculateStdDev(
    amounts,
    userHistory.stats.avgAmount
  );

  // Time stats (hora do dia)
  const hours = times.map((t) => (t / 3600) % 24);
  userHistory.stats.avgTime =
    hours.reduce((a, b) => a + b, 0) / hours.length;

  // Feature stats
  for (let i = 0; i < 28; i++) {
    const featureValues = userHistory.transactions.map((t) => t.features[i]);
    userHistory.featureStats.means[i] =
      featureValues.reduce((a, b) => a + b, 0) / featureValues.length;
    userHistory.featureStats.stds[i] = calculateStdDev(
      featureValues,
      userHistory.featureStats.means[i]
    );
  }
}

/**
 * Calcula desvio padrão
 */
function calculateStdDev(values: number[], mean: number): number {
  if (values.length <= 1) return 0;
  const variance =
    values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
    values.length;
  return Math.sqrt(variance);
}

/**
 * Detecta anomalia de amount (Z-score)
 */
function detectAmountAnomaly(transaction: Transaction): number {
  if (userHistory.stats.stdAmount === 0) return 0; // Sem histórico

  const zScore =
    Math.abs(transaction.amount - userHistory.stats.avgAmount) /
    userHistory.stats.stdAmount;

  // Normalize: 3σ = 1.0 (very anomalous)
  return Math.min(zScore / 3, 1);
}

/**
 * Detecta anomalia de features (Euclidean distance)
 */
function detectFeatureDistance(transaction: Transaction): number {
  if (userHistory.transactions.length === 0) return 0;

  const means = userHistory.featureStats.means;
  let distance = 0;

  for (let i = 0; i < 28; i++) {
    distance += Math.pow(transaction.features[i] - means[i], 2);
  }

  distance = Math.sqrt(distance);

  // Normalize: considerar até 5.0 como máximo
  return Math.min(distance / 5, 1);
}

/**
 * Detecta anomalia de velocidade (múltiplas transações em curto período)
 */
function detectVelocityAnomaly(transaction: Transaction): number {
  // Últimas 5 minutos
  const fiveMinutesAgo = transaction.time - 300;
  const recentTransactions = userHistory.transactions.filter(
    (t) => t.time > fiveMinutesAgo && t.time < transaction.time
  );

  // Se 3+ transações em 5 min, é anomalia
  const count = recentTransactions.length;
  return Math.min(count / 5, 1);
}

/**
 * Detecta anomalia de hora (unusual hour)
 */
function detectTimeAnomaly(transaction: Transaction): number {
  const currentHour = (transaction.time / 3600) % 24;
  const avgHour = userHistory.stats.avgTime;

  // Calcular diferença circular (considerando que 23h e 1h são próximas)
  let diff = Math.abs(currentHour - avgHour);
  if (diff > 12) diff = 24 - diff;

  // Se diferença > 6 horas é anomalia
  return Math.min(diff / 6, 1);
}

/**
 * Análise completa de fraude
 */
export function analyzeFraud(transaction: Transaction): AnalysisResult {
  // Bootstrap: se não tem histórico, aceita tudo
  if (userHistory.transactions.length < 10) {
    return {
      transaction,
      signals: {
        amountAnomaly: 0,
        featureDistance: 0,
        velocityAnomaly: 0,
        timeAnomaly: 0,
      },
      anomalyScore: 0,
      recommendation: "SAFE",
      explanation: "Não há histórico suficiente para análise",
    };
  }

  const signals: FraudSignals = {
    amountAnomaly: detectAmountAnomaly(transaction),
    featureDistance: detectFeatureDistance(transaction),
    velocityAnomaly: detectVelocityAnomaly(transaction),
    timeAnomaly: detectTimeAnomaly(transaction),
  };

  // Score ponderado (maior peso para amount e features)
  const anomalyScore =
    signals.amountAnomaly * 0.4 +
    signals.featureDistance * 0.35 +
    signals.velocityAnomaly * 0.15 +
    signals.timeAnomaly * 0.1;

  // Recomendação
  let recommendation: "SAFE" | "REVIEW" | "FRAUD" = "SAFE";
  if (anomalyScore > 0.7) {
    recommendation = "FRAUD";
  } else if (anomalyScore > 0.4) {
    recommendation = "REVIEW";
  }

  // Explicação
  const explanation = buildExplanation(signals, transaction);

  return {
    transaction,
    signals,
    anomalyScore,
    recommendation,
    explanation,
  };
}

/**
 * Constrói explicação legível
 */
function buildExplanation(
  signals: FraudSignals,
  transaction: Transaction
): string {
  const parts: string[] = [];

  if (signals.amountAnomaly > 0.5) {
    const multiplier = (
      transaction.amount / userHistory.stats.avgAmount
    ).toFixed(1);
    parts.push(
      `Valor ${multiplier}x acima da média (${userHistory.stats.avgAmount.toFixed(2)})`
    );
  }

  if (signals.featureDistance > 0.5) {
    parts.push("Perfil de features muito distante do histórico");
  }

  if (signals.velocityAnomaly > 0.5) {
    parts.push("Múltiplas transações em curto período");
  }

  if (signals.timeAnomaly > 0.5) {
    parts.push("Horário incomum de transação");
  }

  if (parts.length === 0) {
    return "Transação dentro do padrão normal";
  }

  return parts.join(" • ");
}

/**
 * Atualiza histórico com nova transação
 */
export function updateHistory(transaction: Transaction) {
  userHistory.transactions.push(transaction);

  // Manter últimas 1000 transações
  if (userHistory.transactions.length > 1000) {
    userHistory.transactions.shift();
  }

  recalculateStats();

  // Guardar em localStorage para persistência
  try {
    localStorage.setItem(
      "fraudDetector_history",
      JSON.stringify(userHistory.transactions.slice(-100)) // Guardar últimas 100
    );
  } catch (e) {
    console.warn("Não conseguiu salvar histórico:", e);
  }
}

/**
 * Carrega histórico do localStorage
 */
export function loadHistoryFromStorage() {
  try {
    const stored = localStorage.getItem("fraudDetector_history");
    if (stored) {
      const transactions = JSON.parse(stored);
      initializeHistory(transactions);
      console.log(`Histórico carregado: ${transactions.length} transações`);
    }
  } catch (e) {
    console.warn("Erro ao carregar histórico:", e);
  }
}

/**
 * Retorna estatísticas atuais
 */
export function getStats() {
  return {
    transactionsCount: userHistory.transactions.length,
    avgAmount: userHistory.stats.avgAmount,
    stdAmount: userHistory.stats.stdAmount,
    minAmount: userHistory.stats.minAmount,
    maxAmount: userHistory.stats.maxAmount,
  };
}

/**
 * Reset (para testes)
 */
export function reset() {
  userHistory = {
    transactions: [],
    stats: {
      avgAmount: 0,
      stdAmount: 0,
      minAmount: 0,
      maxAmount: 0,
      avgTime: 0,
    },
    featureStats: {
      means: new Array(28).fill(0),
      stds: new Array(28).fill(0),
    },
  };
}
