import AutoSaveStatus from "../components/AutoSaveStatus";
import { useTablerosMateriales } from "../hooks/useTablerosMateriales";

function TablerosMaterialesPage({ obra, onBack }) {
  const t = useTablerosMateriales(obra?.id);

  return (
    <div className="vatio-module">
      <div className="vatio-module-head">
        <div>
          <p className="eyebrow">C1</p>
          <h3>Materiales de tableros</h3>
          <p>Breakers/termomagnéticos por tablero y precios USD.</p>
        </div>
        <div className="module-actions">
          <AutoSaveStatus {...t.saveStatus} />
          <button className="btn-secondary" onClick={onBack}>← Volver</button>
        </div>
      </div>

      <div className="vatio-kpi-row">
        <div className="vatio-kpi"><span>Tableros USD</span><strong>{t.totalObra.tableros_usd.toFixed(2)}</strong></div>
        <div className="vatio-kpi"><span>Materiales USD</span><strong>{t.totalObra.materiales_usd.toFixed(2)}</strong></div>
        <div className="vatio-kpi"><span>Total USD</span><strong>{t.totalObra.total.toFixed(2)}</strong></div>
      </div>

      <div className="vatio-table-wrap">
        <table className="vatio-table">
          <thead>
            <tr>
              <th>Material</th>
              {t.tableros.map((tab) => <th key={tab.id}>{tab.nombre}</th>)}
              <th>Total unidades</th>
              <th>Precio USD</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {t.materiales.map((m) => (
              <tr key={m.id}>
                <td>{m.nombre}</td>
                {t.tableros.map((tab) => (
                  <td key={tab.id}><input type="number" value={t.cantidad(m.id, tab.id)} onChange={(e) => t.actualizarCantidad(m.id, tab.id, e.target.value)} /></td>
                ))}
                <td>{t.totalMaterial(m.id)}</td>
                <td><input type="number" step="0.01" value={t.precio(m.id)} onChange={(e) => t.actualizarPrecio(m.id, e.target.value)} /></td>
                <td>{t.subtotalMaterial(m.id).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TablerosMaterialesPage;
