function TablerosList({ tableros, onVerCircuitos, tableroSeleccionado }) {
  return (
    <div className="tableros-grid">
      {tableros.map((tablero, index) => {
        const colors = ["blue", "green", "orange", "purple"];
        const color = colors[index % colors.length];

        const activo = tableroSeleccionado?.id === tablero.id;

        return (
          <article
            key={tablero.id}
            className={`
              tablero-modern-card
              ${activo ? "active" : ""}
            `}
          >
            <div className="tablero-modern-top">
              <div>
                <p className={`obra-label ${color}`}>Tablero #{tablero.id}</p>

                <h3>{tablero.nombre}</h3>
              </div>

              <div className={`tablero-status ${color}`}>Activo</div>
            </div>

            <div className="tablero-modern-info">
              <p>
                <span>Altura local</span>
                <strong>{tablero.altura_local || "-"}</strong>
              </p>

              <p>
                <span>Altura tablero</span>
                <strong>{tablero.altura_tablero || "-"}</strong>
              </p>

              <p>
                <span>Altura toma</span>
                <strong>{tablero.altura_toma || "-"}</strong>
              </p>

              <p>
                <span>Llave luz</span>
                <strong>{tablero.altura_llave_luz || "-"}</strong>
              </p>

              <p>
                <span>Altura brazo</span>
                <strong>{tablero.altura_brazo || "-"}</strong>
              </p>

              <p>
                <span>Altura especial</span>
                <strong>{tablero.altura_especial || "-"}</strong>
              </p>

              <p>
                <span>Agregado tablero</span>
                <strong>{tablero.agregado_tablero || "-"}</strong>
              </p>

              <p>
                <span>Caja honda</span>
                <strong>{tablero.agregado_caja_honda || "-"}</strong>
              </p>

              <p>
                <span>Caja centro</span>
                <strong>{tablero.agregado_caja_centro || "-"}</strong>
              </p>

              <p>
                <span>Caja brazo</span>
                <strong>{tablero.agregado_caja_brazo || "-"}</strong>
              </p>

              <p>
                <span>H especial</span>
                <strong>{tablero.agregado_h_especial || "-"}</strong>
              </p>

              <p>
                <span>Tipo</span>
                <strong>{tablero.tipo_tablero_id || "-"}</strong>
              </p>
            </div>

            <button
              className={`open-mini-btn ${color}`}
              onClick={() => onVerCircuitos(tablero)}
            >
              → Ver detalle
            </button>
          </article>
        );
      })}
    </div>
  );
}

export default TablerosList;
