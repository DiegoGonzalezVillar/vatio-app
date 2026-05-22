import { calcularTotalesCircuitos } from "../utils/calculosCircuitos";

const n = (value) => Number(value || 0);

const CAJAS_COMPARABLES = [
  { key: "honda", label: "Caja honda", circuitoKey: "ch" },
  { key: "llana", label: "Caja llana", circuitoKey: "cll" },
  { key: "centro", label: "Caja centro", circuitoKey: "cc" },
  { key: "brazo", label: "Caja brazo", circuitoKey: "cb" },
];

const totalTerminacionesComparables = (totales = {}) => (
  CAJAS_COMPARABLES.reduce((acc, item) => acc + n(totales[item.key]?.total), 0)
);

const totalCircuitosComparables = (totales = {}) => (
  CAJAS_COMPARABLES.reduce((acc, item) => acc + n(totales[item.circuitoKey]), 0)
);

const buildComparacion = ({ nombre, totalesCircuitos, totalesTerminaciones }) => {
  const detalles = CAJAS_COMPARABLES.map((item) => {
    const a1 = n(totalesCircuitos?.[item.circuitoKey]);
    const a2 = n(totalesTerminaciones?.[item.key]?.total);
    return {
      ...item,
      a1,
      a2,
      diferencia: a2 - a1,
      estado: a2 > a1 ? "excede" : a2 < a1 ? "menor" : "ok",
    };
  });

  return {
    nombre,
    detalles,
    totalA1: totalCircuitosComparables(totalesCircuitos),
    totalA2: totalTerminacionesComparables(totalesTerminaciones),
    excede: detalles.some((item) => item.estado === "excede"),
    menor: detalles.some((item) => item.estado === "menor"),
  };
};

function TerminacionesValidacion({ tipo, tableros = [], circuitos = [], totalesCircuitos = {}, totalesGlobales = {}, totalesPorTablero }) {
  const moduloCircuitos = tipo === "debiles" ? "B1" : "A1";
  const moduloTerminaciones = tipo === "debiles" ? "B2" : "A2";

  const global = buildComparacion({
    nombre: "Total obra",
    totalesCircuitos,
    totalesTerminaciones: totalesGlobales,
  });

  const porTablero = tableros.map((tablero) => buildComparacion({
    nombre: tablero.nombre,
    totalesCircuitos: calcularTotalesCircuitos(circuitos.filter((circuito) => Number(circuito.tablero_id) === Number(tablero.id))),
    totalesTerminaciones: typeof totalesPorTablero === "function" ? totalesPorTablero(tablero.id) : {},
  }));

  const tablerosConDiferencias = porTablero.filter((item) => item.excede || item.menor);
  const statusClass = global.excede ? "warning" : global.menor ? "notice" : "ok";
  const statusLabel = global.excede ? "Revisar" : global.menor ? "Incompleto" : "OK";

  return (
    <section className={`terminaciones-validation ${statusClass}`}>
      <div className="terminaciones-validation-head">
        <div>
          <p className="eyebrow">Validación {moduloCircuitos} vs {moduloTerminaciones}</p>
          <h4>Cajas detectadas en circuitos vs terminaciones cargadas</h4>
          <p>
            Se consideran {tableros.length} tablero{tableros.length === 1 ? "" : "s"} de la obra. La validación compara solo cajas honda, llana, centro y brazo.
            Cámaras, registros y otros se controlan como cantidades independientes.
          </p>
        </div>
        <span className={`validation-status ${statusClass}`}>{statusLabel}</span>
      </div>

      <div className="validation-summary-grid">
        <div>
          <span>{moduloCircuitos} cajas base</span>
          <strong>{global.totalA1}</strong>
        </div>
        <div>
          <span>{moduloTerminaciones} terminaciones</span>
          <strong>{global.totalA2}</strong>
        </div>
        <div>
          <span>Diferencia</span>
          <strong>{global.totalA2 - global.totalA1}</strong>
        </div>
      </div>

      {global.excede && (
        <p className="validation-message warning">
          Hay terminaciones que superan las cajas detectadas en {moduloCircuitos}. No se bloquea la carga, pero conviene revisar si corresponde.
        </p>
      )}
      {!global.excede && global.menor && (
        <p className="validation-message notice">
          Hay cajas detectadas en {moduloCircuitos} sin terminación asociada en {moduloTerminaciones}. Puede ser correcto, pero queda marcado para revisión.
        </p>
      )}
      {!global.excede && !global.menor && (
        <p className="validation-message ok">Las cajas comparables coinciden entre circuitos y terminaciones.</p>
      )}

      <div className="vatio-table-wrap validation-table-wrap">
        <table className="vatio-table validation-table">
          <thead>
            <tr>
              <th>Caja</th>
              <th>{moduloCircuitos}</th>
              <th>{moduloTerminaciones}</th>
              <th>Diferencia</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {global.detalles.map((item) => (
              <tr key={item.key} className={`validation-row-${item.estado}`}>
                <td>{item.label}</td>
                <td>{item.a1}</td>
                <td>{item.a2}</td>
                <td>{item.diferencia}</td>
                <td>{item.estado === "excede" ? `${moduloTerminaciones} supera ${moduloCircuitos}` : item.estado === "menor" ? "Falta cargar" : "OK"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {tablerosConDiferencias.length > 0 && (
        <details className="validation-details">
          <summary>Ver diferencias por tablero</summary>
          <div className="vatio-table-wrap validation-table-wrap">
            <table className="vatio-table validation-table">
              <thead>
                <tr>
                  <th>Tablero</th>
                  <th>Caja</th>
                  <th>{moduloCircuitos}</th>
                  <th>{moduloTerminaciones}</th>
                  <th>Diferencia</th>
                </tr>
              </thead>
              <tbody>
                {tablerosConDiferencias.flatMap((tablero) => tablero.detalles
                  .filter((item) => item.estado !== "ok")
                  .map((item) => (
                    <tr key={`${tablero.nombre}-${item.key}`} className={`validation-row-${item.estado}`}>
                      <td>{tablero.nombre}</td>
                      <td>{item.label}</td>
                      <td>{item.a1}</td>
                      <td>{item.a2}</td>
                      <td>{item.diferencia}</td>
                    </tr>
                  )))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </section>
  );
}

export default TerminacionesValidacion;
