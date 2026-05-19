import AutoSaveStatus from "../components/AutoSaveStatus";
import { formatDecimal } from "../utils/format";
import CanosResumenTable from "../components/CanosResumenTable";
import { useCanalizaciones } from "../hooks/useCanalizaciones";

function CanalizacionesPage({ obra, onBack }) {
  const { consolidado, coeficiente, setCoeficiente, loading, saveStatus } = useCanalizaciones(obra);

  return (
    <div className="vatio-module">
      <div className="vatio-module-head">
        <div>
          <p className="eyebrow">Canalizaciones y cableados</p>
          <h3>Consolidado automático de {obra?.nombre}</h3>
          <p>Suma A1 + B1 y aplica el coeficiente editable igual que la plantilla Excel.</p>
        </div>
        <div className="module-actions">
          <AutoSaveStatus {...saveStatus} />
          <button className="btn-secondary" onClick={onBack}>← Volver</button>
        </div>
      </div>

      {loading && <p>Cargando...</p>}

      <div className="vatio-kpi-row">
        <label className="vatio-kpi input-kpi">
          <span>Coeficiente de error</span>
          <input type="number" step="0.01" value={coeficiente} onChange={(e) => setCoeficiente(e.target.value)} />
        </label>
        <div className="vatio-kpi">
          <span>Picadas yeso</span>
          <strong>{formatDecimal(consolidado.picadas.yeso, 3)}</strong>
        </div>
        <div className="vatio-kpi">
          <span>Picadas mampostería</span>
          <strong>{formatDecimal(consolidado.picadas.mamposteria, 3)}</strong>
        </div>
        <div className="vatio-kpi">
          <span>Picada piso</span>
          <strong>{formatDecimal(consolidado.picadas.piso, 3)}</strong>
        </div>
        <div className="vatio-kpi">
          <span>Zanja</span>
          <strong>{formatDecimal(consolidado.picadas.zanja, 3)}</strong>
        </div>
      </div>

      <CanosResumenTable
        title="Tensiones débiles"
        data={{
          corrugado: { losa: consolidado.debiles.corrugado_losa, pared: consolidado.debiles.corrugado_pared },
          galvanizado: { losa: consolidado.debiles.galvanizado_losa, pared: consolidado.debiles.galvanizado_pared },
          pvc: { losa: consolidado.debiles.pvc_losa, pared: consolidado.debiles.pvc_pared },
        }}
      />

      <CanosResumenTable
        title="Eléctrica"
        data={{
          corrugado: { losa: consolidado.electrica.corrugado_losa, pared: consolidado.electrica.corrugado_pared },
          galvanizado: { losa: consolidado.electrica.galvanizado_losa, pared: consolidado.electrica.galvanizado_pared },
          pvc: { losa: consolidado.electrica.pvc_losa, pared: consolidado.electrica.pvc_pared },
        }}
      />

      <CanosResumenTable title={`Sumatoria con coeficiente ${formatDecimal(coeficiente, 2)}`} data={consolidado.total_con_coeficiente} />
    </div>
  );
}

export default CanalizacionesPage;
