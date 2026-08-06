type SummaryCardProps = {
  label: string;
  value: string;
  detail: string;
  tone?: "positive" | "negative" | "neutral";
};

export function SummaryCard({
  label,
  value,
  detail,
  tone = "neutral",
}: SummaryCardProps) {
  return (
    <article className="summary-card">
      <div className="summary-card-topline">
        <span>{label}</span>
        <span className={`summary-indicator summary-indicator-${tone}`} />
      </div>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}
