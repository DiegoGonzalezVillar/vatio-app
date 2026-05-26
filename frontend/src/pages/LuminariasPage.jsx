import AutoSaveStatus from "../components/AutoSaveStatus";
import { useLuminarias } from "../hooks/useLuminarias";
import { TIPOS_LUMINARIA } from "../utils/vatioConstants";

function LuminariasPage({ obra, onBack }) {
  const pisos = obra?.pisos || ["PB"];
  const lum = useLuminarias(obra?.id, pisos);

  return (
    <div className="vatio-module">
      <div className="vatio-module-head">
        <div>
          <p className="eyebrow">E1</p>
          <h3>Luminarias</h3>
          <p>Tipos, descripción y cantidades por planta.</p>
        </div>
        <div className="module-actions">
          <AutoSaveStatus {...lum.saveStatus} />
          <button className="btn-secondary" onClick={onBack}>← Volver</button>
        </div>
      </div>

      <div className="vatio-table-wrap">
        <table className="vatio-table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Descripción</th>
              {pisos.map((p) => <th key={p}>{p}</th>)}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {TIPOS_LUMINARIA.map((tipo) => (
              <tr key={tipo}>
                <td>{tipo}</td>
                <td><input value={lum.descripcion(tipo)} onChange={(e) => lum.actualizarDescripcion(tipo, e.target.value)} /></td>
                {pisos.map((p) => (
                  <td key={p}><input type="number" value={lum.cantidad(tipo, p)} onChange={(e) => lum.actualizarCantidad(tipo, p, e.target.value)} /></td>
                ))}
                <td>{lum.totalPorTipo(tipo)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr><td colSpan={2 + pisos.length}>Total general</td><td>{lum.totalGeneral}</td></tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default LuminariasPage;
