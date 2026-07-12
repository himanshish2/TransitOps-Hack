function getScoreColor(score) {
  if (score >= 80) return 'var(--success-color)';
  if (score >= 60) return 'var(--warning-color)';
  return 'var(--danger-color)';
}

export default function SafetyScoreBadge({ score }) {
  const color = getScoreColor(score);
  return (
    <div className="d-flex align-items-center gap-xs">
      <span className="fw-medium" style={{ fontSize: 'var(--font-size-sm)', color }}>{score}</span>
      <div className="safety-score-bar-track">
        <div
          className="safety-score-bar-fill"
          style={{ width: `${Math.min(100, Math.max(0, score))}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
