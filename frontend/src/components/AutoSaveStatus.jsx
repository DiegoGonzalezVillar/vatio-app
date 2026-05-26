function AutoSaveStatus({ status = "idle", message = "" }) {
  if (!status || status === "idle") return null;

  const labels = {
    saving: message || "Guardando cambios...",
    saved: message || "Cambios guardados",
    error: message || "Error al guardar",
    loading: message || "Cargando...",
  };

  return (
    <div className={`autosave-status ${status}`} role="status" aria-live="polite">
      <span className="autosave-dot" />
      {labels[status] || message}
    </div>
  );
}

export default AutoSaveStatus;
