import AutoSaveStatus from "../components/AutoSaveStatus";
import { useDuctos } from "../hooks/useDuctos";
import { SISTEMAS, TAMAÑOS_DUCTO } from "../utils/vatioConstants";
import { formatDecimal } from "../utils/format";

const SYSTEM_LABELS = {
  electrica: "Eléctrica",
  datos: "Datos",
};

const FIELDS = [
  { key: "metros", label: "Metros", unit: "m", digits: 2 },
  { key: "quiebres", label: "Quiebres", unit: "unid", digits: 0 },
];

function DuctosPage({ obra, onBack }) {
  const pisos = obra?.pisos || ["PB"];
  const d = useDuctos(obra?.id, pisos);

  const renderInput = (tamaño, sistema, piso, campo) => {
    const value = d.valor(tamaño, sistema, piso, campo);
    return (
      <input
        type="text"
        inputMode="decimal"
        value={value ? String(value).replace(".", ",") : ""}
        placeholder="0"
        onChange={(e) => d.actualizar(tamaño, sistema, piso, campo, e.target.value)}
        aria-label={`${campo} ${tamaño} ${sistema} ${piso}`}
      />
    );
  };

  const renderResumenTable = () => {
    if (!d.filasConValores.length) {
      return (
        <div className="vatio-table-wrap ductos-resumen-wrap">
          <table className="vatio-table ductos-summary-table">
            <thead>
              <tr>
                <th>Sistema</th>
                <th>Tipo ducto</th>
                <th>Piso</th>
                <th>Metros (m)</th>
                <th>Quiebres (unid)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="5" className="empty-table-cell">Sin valores cargados.</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <div className="vatio-table-wrap ductos-resumen-wrap">
        <table className="vatio-table ductos-summary-table">
          <thead>
            <tr>
              <th>Sistema</th>
              <th>Tipo ducto</th>
              <th>Piso</th>
              <th>Metros (m)</th>
              <th>Quiebres (unid)</th>
            </tr>
          </thead>
          <tbody>
            {d.filasConValores.map((row) => (
              <tr key={`${row.tamaño}-${row.sistema}-${row.piso}`}>
                <td>{SYSTEM_LABELS[row.sistema] || row.sistema}</td>
                <td>{row.tamaño}</td>
                <td>{row.piso}</td>
                <td>{formatDecimal(row.metros, 2)}</td>
                <td>{formatDecimal(row.quiebres, 0)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3">Total</td>
              <td>{formatDecimal(d.resumenGeneral.metros, 2)}</td>
              <td>{formatDecimal(d.resumenGeneral.quiebres, 0)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  };

  return (
    <div className="vatio-module ductos-page">
      <div className="vatio-module-head">
        <div>
          <p className="eyebrow">AB2</p>
          <h3>Ductos</h3>
          <p>Metros y quiebres por tipo de ducto, sistema y planta.</p>
        </div>
        <div className="module-actions">
          <AutoSaveStatus {...d.saveStatus} />
          <button className="btn-secondary" onClick={onBack}>← Volver</button>
        </div>
      </div>

      <div className="vatio-kpi-row ductos-kpis">
        <div className="vatio-kpi">
          <span>Metraje ductos</span>
          <strong>{formatDecimal(d.resumenGeneral.metros, 2)} m</strong>
        </div>
        <div className="vatio-kpi">
          <span>Quiebres</span>
          <strong>{formatDecimal(d.resumenGeneral.quiebres, 0)} unid</strong>
        </div>
        <div className="vatio-kpi">
          <span>Registros con datos</span>
          <strong>{d.resumenGeneral.registros}</strong>
        </div>
      </div>

      <section className="ductos-section">
        <div className="ductos-section-head">
          <div>
            <h4>Resumen cargado</h4>
            <p>Se muestran solo las combinaciones con al menos un valor distinto de cero.</p>
          </div>
          <span className="unit-pill">Unidad: m / unid</span>
        </div>
        {renderResumenTable()}
      </section>

      {SISTEMAS.map((sistema) => {
        const sistemaResumen = d.resumenSistema(sistema, TAMAÑOS_DUCTO);
        return (
          <section key={sistema} className="ductos-section">
            <div className="ductos-section-head">
              <div>
                <h4>{SYSTEM_LABELS[sistema]}</h4>
                <p>Total sistema: {formatDecimal(sistemaResumen.metros, 2)} m · Quiebres: {formatDecimal(sistemaResumen.quiebres, 0)} unid</p>
              </div>
              <span className="unit-pill">Unidad: m / unid</span>
            </div>

            {TAMAÑOS_DUCTO.map((tamaño) => {
              const totals = d.resumen(tamaño, sistema);
              return (
                <div key={`${tamaño}-${sistema}`} className="vatio-table-wrap ductos-table-wrap">
                  <div className="ductos-table-title">
                    <strong>{tamaño}</strong>
                    <span>Metros: {formatDecimal(totals.metros, 2)} m · Quiebres: {formatDecimal(totals.quiebres, 0)} unid</span>
                  </div>
                  <table className="vatio-table ductos-table">
                    <thead>
                      <tr>
                        <th className="ductos-col-piso">Piso</th>
                        {FIELDS.map((field) => (
                          <th key={field.key}>
                            {field.label}
                            <small>{field.unit}</small>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {pisos.map((piso) => (
                        <tr key={piso}>
                          <td>{piso}</td>
                          {FIELDS.map((field) => (
                            <td key={field.key}>{renderInput(tamaño, sistema, piso, field.key)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td>Total</td>
                        {FIELDS.map((field) => (
                          <td key={field.key}>{formatDecimal(totals[field.key], field.digits)}</td>
                        ))}
                      </tr>
                    </tfoot>
                  </table>
                </div>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}

export default DuctosPage;
