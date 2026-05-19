import AutoSaveStatus from "../components/AutoSaveStatus";
import PicadasResumen from "../components/PicadasResumen";
import TerminacionesGrid from "../components/TerminacionesGrid";
import { useCircuitosTotales } from "../hooks/useCircuitosTotales";
import { useTerminaciones } from "../hooks/useTerminaciones";

function TerminacionesPage({ obra, tipo, onBack }) {
  const term = useTerminaciones(obra?.id, tipo);
  const { totales } = useCircuitosTotales(obra?.id, tipo);

  return (
    <div className="vatio-module">
      <div className="vatio-module-head">
        <div>
          <p className="eyebrow">{tipo === "debiles" ? "B2" : "A2"}</p>
          <h3>Terminaciones {tipo === "debiles" ? "T. Débiles" : "Eléctrica"}</h3>
          <p>Cantidades por tablero, material y tipo de caja.</p>
        </div>
        <div className="module-actions">
          <AutoSaveStatus {...term.saveStatus} />
          <button className="btn-secondary" onClick={onBack}>← Volver</button>
        </div>
      </div>
      <PicadasResumen totalesCircuitos={totales} />
      <TerminacionesGrid {...term} />
    </div>
  );
}

export default TerminacionesPage;
