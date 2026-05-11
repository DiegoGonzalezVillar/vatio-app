function StatCard({ label, value, description }) {
  return (
    <div className="stat-card">
      <span>{label}</span>

      <strong>{value}</strong>

      <p>{description}</p>
    </div>
  );
}

export default StatCard;
