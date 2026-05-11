function TablerosList({ tableros, onVerCircuitos }) {
  return (
    <div className="tableros-list">
      {tableros.map((tablero) => (
        <div className="tablero-card" key={tablero.id}>
          <h3>{tablero.nombre}</h3>

          <p>Altura local: {tablero.altura_local || "-"}</p>
          <p>Altura tablero: {tablero.altura_tablero || "-"}</p>
          <p>Altura toma: {tablero.altura_toma || "-"}</p>
          <p>Altura llave: {tablero.altura_llave_luz || "-"}</p>

          <div className="button-row">
            <button
              className="btn-primary"
              onClick={() => onVerCircuitos(tablero)}
            >
              Abrir tablero
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TablerosList;
