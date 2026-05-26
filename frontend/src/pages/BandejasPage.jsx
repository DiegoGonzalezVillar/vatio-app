import AutoSaveStatus from "../components/AutoSaveStatus";
import { useBandejas } from "../hooks/useBandejas";
import { ANCHOS_BANDEJA, CAMPOS_BANDEJA, SISTEMAS } from "../utils/vatioConstants";
import { formatDecimal } from "../utils/format";

const FIELD_LABELS = {
  metraje: "Metraje",
  tapa: "Tapa",
  curva_horizontal: "Curva horiz.",
  curva_articulada: "Curva art.",
  vertical_ext: "Vertical ext.",
  vertical_int: "Vertical int.",
  cruces_h: "Cruce horiz.",
  cruces_v: "Cruce vert.",
  descenso: "Descenso",
  derivacion: "Derivación",
  desvio_h: "Desvío horiz.",
  desvio_h_izq: "Desvío H izq.",
  desvio_h_der: "Desvío H der.",
  desvio_v: "Desvío vert.",
};

const FIELD_UNITS = {
  metraje: "m",
  tapa: "m",
  curva_horizontal: "unid",
  curva_articulada: "unid",
  vertical_ext: "unid",
  vertical_int: "unid",
  cruces_h: "unid",
  cruces_v: "unid",
  descenso: "unid",
  derivacion: "unid",
  desvio_h: "unid",
  desvio_h_izq: "unid",
  desvio_h_der: "unid",
  desvio_v: "unid",
};

const SYSTEM_LABELS = {
  electrica: "Eléctrica",
  datos: "Datos",
};

const METER_FIELDS = new Set(["metraje", "tapa"]);

const formatFieldValue = (field, value) => {
  if (field === "tapa") return formatDecimal(value, 2);
  return METER_FIELDS.has(field) ? formatDecimal(value, 2) : formatDecimal(value, 0);
};

function BandejasPage({ obra, onBack }) {
  const pisos = obra?.pisos || ["PB"];
  const b = useBandejas(obra?.id, pisos);

  const renderInput = (ancho, sistema, piso, campo) => {
    const value = b.valor(ancho, sistema, piso, campo);

    if (campo === "tapa") {
      return (
        <select
          value={value}
          onChange={(e) => b.actualizar(ancho, sistema, piso, campo, e.target.value)}
          aria-label={`Tapa ${ancho} ${sistema} ${piso}`}
        >
          <option value="no">No</option>
          <option value="si">Sí</option>
        </select>
      );
    }

    return (
      <input
        type="text"
        inputMode="decimal"
        value={value ? String(value).replace(".", ",") : ""}
        placeholder="0"
        onChange={(e) => b.actualizar(ancho, sistema, piso, campo, e.target.value)}
        aria-label={`${FIELD_LABELS[campo]} ${ancho} ${sistema} ${piso}`}
      />
    );
  };

  const renderResumenTable = () => {
    if (!b.filasConValores.length) {
      return (
        <div className="vatio-table-wrap bandejas-resumen-wrap">
          <table className="vatio-table bandejas-summary-table">
            <thead>
              <tr>
                <th>Sistema</th>
                <th>Ancho</th>
                <th>Piso</th>
                <th>Metraje (m)</th>
                <th>Tapa (m)</th>
                <th>Accesorios (unid)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="6" className="empty-table-cell">Sin valores cargados.</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <div className="vatio-table-wrap bandejas-resumen-wrap">
        <table className="vatio-table bandejas-summary-table">
          <thead>
            <tr>
              <th>Sistema</th>
              <th>Ancho</th>
              <th>Piso</th>
              <th>Metraje (m)</th>
              <th>Tapa (m)</th>
              <th>Accesorios (unid)</th>
            </tr>
          </thead>
          <tbody>
            {b.filasConValores.map((row) => {
              const tapaM = String(row.tapa || "no").toLowerCase().startsWith("s") ? Number(row.metraje || 0) : 0;
              const accesorios = CAMPOS_BANDEJA
                .filter((campo) => !["metraje", "tapa"].includes(campo))
                .reduce((sum, campo) => sum + Number(row[campo] || 0), 0);

              return (
                <tr key={`${row.ancho_mm}-${row.sistema}-${row.piso}`}>
                  <td>{SYSTEM_LABELS[row.sistema] || row.sistema}</td>
                  <td>{row.ancho_mm}</td>
                  <td>{row.piso}</td>
                  <td>{formatDecimal(row.metraje, 2)}</td>
                  <td>{formatDecimal(tapaM, 2)}</td>
                  <td>{formatDecimal(accesorios, 0)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3">Total</td>
              <td>{formatDecimal(b.resumenGeneral.metraje, 2)}</td>
              <td>{formatDecimal(b.resumenGeneral.tapa, 2)}</td>
              <td>{formatDecimal(b.resumenGeneral.accesorios, 0)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  };

  return (
    <div className="vatio-module bandejas-page">
      <div className="vatio-module-head">
        <div>
          <p className="eyebrow">AB1</p>
          <h3>Bandejas</h3>
          <p>Metrado por ancho, sistema y planta. Si una bandeja lleva tapa, la tapa suma el mismo metraje.</p>
        </div>
        <div className="module-actions">
          <AutoSaveStatus {...b.saveStatus} />
          <button className="btn-secondary" onClick={onBack}>← Volver</button>
        </div>
      </div>

      <div className="vatio-kpi-row bandejas-kpis">
        <div className="vatio-kpi">
          <span>Metraje bandejas</span>
          <strong>{formatDecimal(b.resumenGeneral.metraje, 2)} m</strong>
        </div>
        <div className="vatio-kpi">
          <span>Tapas</span>
          <strong>{formatDecimal(b.resumenGeneral.tapa, 2)} m</strong>
        </div>
        <div className="vatio-kpi">
          <span>Accesorios</span>
          <strong>{formatDecimal(b.resumenGeneral.accesorios, 0)} unid</strong>
        </div>
        <div className="vatio-kpi">
          <span>Registros con datos</span>
          <strong>{b.resumenGeneral.registros}</strong>
        </div>
      </div>

      <section className="bandejas-section">
        <div className="bandejas-section-head">
          <div>
            <h4>Resumen cargado</h4>
            <p>Se muestran solo las combinaciones con al menos un valor distinto de cero.</p>
          </div>
          <span className="unit-pill">Unidad: m / unid</span>
        </div>
        {renderResumenTable()}
      </section>

      {SISTEMAS.map((sistema) => {
        const sistemaResumen = b.resumenSistema(sistema, ANCHOS_BANDEJA);
        return (
          <section key={sistema} className="bandejas-section">
            <div className="bandejas-section-head">
              <div>
                <h4>{SYSTEM_LABELS[sistema]}</h4>
                <p>Total sistema: {formatDecimal(sistemaResumen.metraje, 2)} m · Tapas: {formatDecimal(sistemaResumen.tapa, 2)} m</p>
              </div>
              <span className="unit-pill">Unidad: m / unid</span>
            </div>

            {ANCHOS_BANDEJA.map((ancho) => {
              const totals = b.resumen(ancho, sistema);
              return (
                <div key={`${ancho}-${sistema}`} className="vatio-table-wrap bandejas-table-wrap">
                  <div className="bandejas-table-title">
                    <strong>{ancho}</strong>
                    <span>Metraje: {formatDecimal(totals.metraje, 2)} m · Tapa: {formatDecimal(totals.tapa, 2)} m</span>
                  </div>
                  <table className="vatio-table bandejas-table">
                    <thead>
                      <tr>
                        <th className="bandejas-col-piso">Piso</th>
                        {CAMPOS_BANDEJA.map((campo) => (
                          <th key={campo} title={`${FIELD_LABELS[campo]} (${FIELD_UNITS[campo]})`}>
                            {FIELD_LABELS[campo]}
                            <small>{FIELD_UNITS[campo]}</small>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {pisos.map((piso) => (
                        <tr key={piso}>
                          <td>{piso}</td>
                          {CAMPOS_BANDEJA.map((campo) => (
                            <td key={campo}>{renderInput(ancho, sistema, piso, campo)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td>Total</td>
                        {CAMPOS_BANDEJA.map((campo) => (
                          <td key={campo}>{formatFieldValue(campo, totals[campo])}</td>
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

export default BandejasPage;
