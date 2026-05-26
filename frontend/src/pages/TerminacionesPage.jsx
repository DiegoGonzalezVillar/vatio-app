import AutoSaveStatus from "../components/AutoSaveStatus";
import PicadasResumen from "../components/PicadasResumen";
import TerminacionesGrid from "../components/TerminacionesGrid";
import TerminacionesValidacion from "../components/TerminacionesValidacion";
import { useCircuitosTotales } from "../hooks/useCircuitosTotales";
import { useTerminaciones } from "../hooks/useTerminaciones";
import { TIPOS_CAJA_TERMINACIONES } from "../utils/vatioConstants";

const etiquetas = {
  LLANA: "Caja llana",
  HONDA: "Caja honda",
  CENTRO: "Caja centro",
  BRAZO: "Caja brazo",
  CAMARA: "Cámaras",
  REGISTRO: "Registros",
  OTROS: "Otros",
};

function TerminacionesPage({ obra, tipo, onBack }) {
  const term = useTerminaciones(obra?.id, tipo);
  const { circuitos, totales } = useCircuitosTotales(obra?.id, tipo);

  return (
    <div className="vatio-module">
      <div className="vatio-module-head">
        <div>
          <p className="eyebrow">{tipo === "debiles" ? "B2" : "A2"}</p>
          <h3>Terminaciones {tipo === "debiles" ? "T. Débiles" : "Eléctrica"}</h3>
          <p>Cantidades por tablero, material y tipo de caja según la planilla Excel.</p>
        </div>
        <div className="module-actions">
          <AutoSaveStatus {...term.saveStatus} />
          <button className="btn-secondary" onClick={onBack}>← Volver</button>
        </div>
      </div>

      <PicadasResumen totalesCircuitos={totales} />

      <TerminacionesValidacion
        tipo={tipo}
        tableros={term.tableros}
        circuitos={circuitos}
        totalesCircuitos={totales}
        totalesGlobales={term.totalesGlobales}
        totalesPorTablero={term.totalesPorTablero}
      />

      <section className="terminaciones-summary">
        {TIPOS_CAJA_TERMINACIONES.map((tipoCaja) => {
          const key = tipoCaja.toLowerCase();
          const total = term.totalesGlobales?.[key]?.total || 0;
          return (
            <div className="term-summary-card" key={tipoCaja}>
              <span>{etiquetas[tipoCaja] || tipoCaja}</span>
              <strong>{total}</strong>
            </div>
          );
        })}
      </section>

      {term.loading ? <p>Cargando terminaciones...</p> : <TerminacionesGrid {...term} />}
    </div>
  );
}

export default TerminacionesPage;
