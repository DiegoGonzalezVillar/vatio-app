import { calcularDatosTablero } from "../utils/calculosTablero";

function TableroDetalle({ tablero }) {
  if (!tablero) return null;

  const calculos = calcularDatosTablero(tablero);

  return (
    <div className="page-card tablero-detalle">
      <div className="section-header">
        <div>
          <p className="eyebrow">Tablero seleccionado</p>
          <h2>{tablero.nombre}</h2>
        </div>
      </div>

      <h3>Cálculos automáticos</h3>

      <div className="calculos-grid">
        <div>
          <span>Bajada llave luz</span>
          <strong>{calculos.bajada_llave_luz}</strong>
        </div>

        <div>
          <span>Bajada toma</span>
          <strong>{calculos.bajada_toma}</strong>
        </div>

        <div>
          <span>Bajada tablero</span>
          <strong>{calculos.bajada_tablero}</strong>
        </div>

        <div>
          <span>Bajada brazo</span>
          <strong>{calculos.bajada_brazo}</strong>
        </div>

        <div>
          <span>Bajada especial</span>
          <strong>{calculos.bajada_especial}</strong>
        </div>

        <div>
          <span>Total tablero</span>
          <strong>{calculos.total_tablero}</strong>
        </div>

        <div>
          <span>Total caja honda</span>
          <strong>{calculos.total_caja_honda}</strong>
        </div>

        <div>
          <span>Total caja centro</span>
          <strong>{calculos.total_caja_centro}</strong>
        </div>

        <div>
          <span>Total caja brazo</span>
          <strong>{calculos.total_caja_brazo}</strong>
        </div>

        <div>
          <span>Total H especial</span>
          <strong>{calculos.total_h_especial}</strong>
        </div>
      </div>

      <hr />

      <div className="modulos-tecnicos-grid">
        <button className="modulo-tecnico-card">
          <span>⚡</span>
          <h3>Circuitos</h3>
          <p>Cargar circuitos, conductores, protecciones y cajas.</p>
        </button>

        <button className="modulo-tecnico-card">
          <span>🧰</span>
          <h3>Bandejas</h3>
          <p>Registrar metrajes, tapas, curvas y accesorios.</p>
        </button>

        <button className="modulo-tecnico-card">
          <span>📏</span>
          <h3>Ductos</h3>
          <p>Cargar ductos, medidas, recorridos y derivaciones.</p>
        </button>

        <button className="modulo-tecnico-card">
          <span>🔌</span>
          <h3>Terminaciones</h3>
          <p>Gestionar bocas, cajas, tomas, llaves y artefactos.</p>
        </button>

        <button className="modulo-tecnico-card">
          <span>📊</span>
          <h3>Reporte tablero</h3>
          <p>Ver resumen técnico y materiales calculados.</p>
        </button>
      </div>
    </div>
  );
}

export default TableroDetalle;
