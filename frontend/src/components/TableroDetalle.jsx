function TableroDetalle({ tablero }) {
  if (!tablero) {
    return null;
  }

  const calculos = [
    {
      label: "Altura tablero",
      value: tablero.altura_tablero || "-",
      color: "blue",
      icon: "▦",
    },
    {
      label: "Altura toma",
      value: tablero.altura_toma || "-",
      color: "green",
      icon: "⚡",
    },
    {
      label: "Llave luz",
      value: tablero.altura_llave_luz || "-",
      color: "orange",
      icon: "◫",
    },
    {
      label: "Altura brazo",
      value: tablero.altura_brazo || "-",
      color: "purple",
      icon: "↕",
    },
    {
      label: "Altura especial",
      value: tablero.altura_especial || "-",
      color: "blue",
      icon: "◎",
    },
  ];

  const modulos = [
    {
      title: "Circuitos",
      description: "Gestión y cálculo de circuitos eléctricos.",
      icon: "⚡",
      color: "blue",
    },
    {
      title: "Bandejas",
      description: "Distribución y recorrido de bandejas.",
      icon: "▤",
      color: "green",
    },
    {
      title: "Cañerías",
      description: "Canalizaciones y conexiones técnicas.",
      icon: "◫",
      color: "orange",
    },
    {
      title: "Iluminación",
      description: "Configuración de luminarias y alturas.",
      icon: "✦",
      color: "purple",
    },
    {
      title: "Materiales",
      description: "Consolidado técnico y metrados.",
      icon: "◩",
      color: "blue",
    },
  ];

  return (
    <section className="tablero-detalle-wrapper">
      <div className="tablero-detalle-hero">
        <div>
          <p className="eyebrow">Tablero seleccionado</p>

          <h2>{tablero.nombre}</h2>

          <p>
            Visualiza cálculos automáticos, configuraciones técnicas y módulos
            relacionados al tablero.
          </p>
        </div>

        <div className="tablero-hero-chip">ID #{tablero.id}</div>
      </div>

      <section className="detalle-section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Cálculos</p>

            <h3>Métricas técnicas</h3>
          </div>
        </div>

        <div className="detalle-kpis-grid">
          {calculos.map((item) => (
            <article key={item.label} className="detalle-kpi-card">
              <div
                className={`
                  detalle-kpi-icon
                  ${item.color}
                `}
              >
                {item.icon}
              </div>

              <span>{item.label}</span>

              <strong>{item.value}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="detalle-section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Módulos técnicos</p>

            <h3>Herramientas del tablero</h3>
          </div>
        </div>

        <div className="detalle-modulos-grid">
          {modulos.map((modulo) => (
            <article key={modulo.title} className="detalle-modulo-card">
              <div
                className={`
                  detalle-modulo-icon
                  ${modulo.color}
                `}
              >
                {modulo.icon}
              </div>

              <h4>{modulo.title}</h4>

              <p>{modulo.description}</p>

              <button
                className={`
                  open-mini-btn
                  ${modulo.color}
                `}
              >
                → Abrir módulo
              </button>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

export default TableroDetalle;
