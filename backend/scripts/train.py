from app.services.fraud_processor import FraudProcessor
import json


def print_metrics(title, metrics):
    print("\n" + title)
    print(json.dumps(metrics, indent=2, ensure_ascii=False))


from sklearn.metrics import precision_recall_curve, f1_score, precision_score, recall_score
import numpy as np

def threshold_search(y_true, y_proba, recall_min=0.7):
    precision, recall, thresholds = precision_recall_curve(y_true, y_proba)
    f1 = 2 * (precision * recall) / (precision + recall + 1e-8)
    best = np.argmax(f1)
    best_threshold = thresholds[best] if best < len(thresholds) else 0.5
    best_f1 = f1[best]

    # Busca threshold com recall >= recall_min e maior precisão
    valid = np.where(recall >= recall_min)[0]
    if len(valid) > 0:
        idx = valid[np.argmax(precision[valid])]
        threshold_recall = thresholds[idx] if idx < len(thresholds) else 0.5
        return {
            'best_f1': float(best_f1),
            'best_threshold': float(best_threshold),
            'precision_at_best_f1': float(precision[best]),
            'recall_at_best_f1': float(recall[best]),
            'threshold_recall_min': float(threshold_recall),
            'precision_at_recall_min': float(precision[idx]),
            'recall_at_recall_min': float(recall[idx]),
        }
    else:
        return {
            'best_f1': float(best_f1),
            'best_threshold': float(best_threshold),
            'precision_at_best_f1': float(precision[best]),
            'recall_at_best_f1': float(recall[best]),
        }

def print_threshold_table(y_true, y_proba):
    precision, recall, thresholds = precision_recall_curve(y_true, y_proba)
    print("\nThreshold | Precision | Recall | F1")
    for t, p, r in zip(thresholds[::10], precision[::10], recall[::10]):
        f1 = 2 * p * r / (p + r + 1e-8)
        print(f"{t:.3f}\t{p:.3f}\t{r:.3f}\t{f1:.3f}")

if __name__ == '__main__':
    fp = FraudProcessor()
    print('Carregando dados...')
    df = fp.load_data()
    print(f'Dados carregados: {len(df)} linhas')

    X, y = fp.preprocess()

    # Logistic with SMOTE
    print("\n=== Logistic Regression (SMOTE) ===")
    metrics = fp.train_and_evaluate(X, y, model_type='logistic', resample='smote')
    print_metrics('Logistic (SMOTE, default threshold)', metrics)

    # Re-treina para obter proba/test split
    from sklearn.model_selection import train_test_split
    X_train, X_test, y_train, y_test = train_test_split(X, y, stratify=y, test_size=0.2, random_state=42)
    from imblearn.over_sampling import SMOTE
    sm = SMOTE(random_state=42)
    X_train_res, y_train_res = sm.fit_resample(X_train, y_train)
    from sklearn.linear_model import LogisticRegression
    model = LogisticRegression(max_iter=2000, class_weight="balanced", random_state=42)
    model.fit(X_train_res, y_train_res)
    y_proba = model.predict_proba(X_test)[:, 1]
    y_pred = model.predict(X_test)

    # Busca threshold ótimo
    search = threshold_search(y_test, y_proba, recall_min=0.7)
    print("\nThreshold tuning (Logistic, SMOTE):")
    print(json.dumps(search, indent=2))
    print_threshold_table(y_test, y_proba)

    # Mostra métricas com threshold ótimo
    if 'threshold_recall_min' in search:
        th = search['threshold_recall_min']
        y_pred_th = (y_proba >= th).astype(int)
        print("\nMétricas com threshold para recall mínimo:")
        print(json.dumps({
            'precision': float(precision_score(y_test, y_pred_th)),
            'recall': float(recall_score(y_test, y_pred_th)),
            'f1': float(f1_score(y_test, y_pred_th)),
        }, indent=2))

    print('\nTreino concluído.')
