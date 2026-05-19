import AutoSaveStatus from "../components/AutoSaveStatus";
import { usePuestaATierra } from "../hooks/usePuestaATierra";

function PuestaATierraPage({ obra, onBack }) {
  const { items, cantidades, actualizar, saveStatus } = usePuestaATierra(obra?.id);

  return (
    <div className="vatio-module">
      <div className="vatio-module-head">
        <div>
          <p className="eyebrow">A3</p>
          <h3>Puesta a tierra</h3>
          <p>Materiales fijos de puesta a tierra por obra.</p>
        </div>
        <div className="module-actions">
          <AutoSaveStatus {...saveStatus} />
          <button className="btn-secondary" onClick={onBack}>← Volver</button>
        </div>
      </div>

      <div className="vatio-edit-grid">
        {items.map((item) => (
          <label className="form-field" key={item.id}>
            {item.label} ({item.unidad})
            <input type="number" step="0.01" value={cantidades[item.id] || ""} onChange={(e) => actualizar(item.id, e.target.value)} />
          </label>
        ))}
      </div>
    </div>
  );
}

export default PuestaATierraPage;
