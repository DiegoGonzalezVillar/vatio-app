function ResumenCard({ label, value, helper }) {
  return (
    <article className="resumen-card">
      <span>{label}</span>
      <strong>{value}</strong>
      {helper ? <p>{helper}</p> : null}
    </article>
  );
}

export default ResumenCard;
