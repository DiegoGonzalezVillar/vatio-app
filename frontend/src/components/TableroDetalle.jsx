import { calcularDatosTablero } from "../utils/calculosTablero";

function TableroDetalle({ tablero }) {
  if (!tablero) {
    return null;
  }

  const datosCalculados = calcularDatosTablero(tablero);

  const calculos = [
    {
      label: "Bajada llave luz",
      value: datosCalculados.bajada_llave_luz,
      color: "blue",
      icon: "↓",
    },

    {
      label: "Bajada toma",
      value: datosCalculados.bajada_toma,
      color: "green",
      icon: "⚡",
    },

    {
      label: "Bajada tablero",
      value: datosCalculados.bajada_tablero,
      color: "orange",
      icon: "▦",
    },

    {
      label: "Bajada brazo",
      value: datosCalculados.bajada_brazo,
      color: "purple",
      icon: "↕",
    },

    {
      label: "Bajada especial",
      value: datosCalculados.bajada_especial,
      color: "blue",
      icon: "◎",
    },

    {
      label: "Total tablero",
      value: datosCalculados.total_tablero,
      color: "green",
      icon: "◩",
    },

    {
      label: "Total caja honda",
      value: datosCalculados.total_caja_honda,
      color: "orange",
      icon: "◫",
    },

    {
      label: "Total caja centro",
      value: datosCalculados.total_caja_centro,
      color: "purple",
      icon: "✦",
    },

    {
      label: "Total caja brazo",
      value: datosCalculados.total_caja_brazo,
      color: "blue",
      icon: "▤",
    },

    {
      label: "Total h especial",
      value: datosCalculados.total_h_especial,
      color: "green",
      icon: "◆",
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
            <p className="eyebrow">Cálculos automáticos</p>

            <h3>Resultados técnicos derivados</h3>
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

              <strong>{Number(item.value).toFixed(2)}</strong>
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
