import { DIAMETROS } from "../utils/vatioConstants";
import { formatDecimal, parseDecimalValue } from "../utils/format";

const n = (v) => formatDecimal(v, 3);
const hasValue = (v) => Math.abs(parseDecimalValue(v, 0)) > 0.0000001;

function CanosResumenTable({ title, data, showZeroRows = false, unit = "m" }) {
  const grupos = ["corrugado", "galvanizado", "pvc"];

  const rows = grupos
    .flatMap((grupo) =>
      ["losa", "pared"].map((uso) => {
        const valores = DIAMETROS.map((diametro) => ({
          diametro,
          valor: data?.[grupo]?.[uso]?.[diametro],
        }));

        return {
          grupo,
          uso,
          valores,
          total: valores.reduce((acc, { valor }) => acc + parseDecimalValue(valor, 0), 0),
        };
      }),
    )
    .filter((row) => showZeroRows || row.valores.some(({ valor }) => hasValue(valor)));

  const totalsByDiametro = DIAMETROS.map((diametro) =>
    rows.reduce((acc, row) => {
      const match = row.valores.find((v) => v.diametro === diametro);
      return acc + parseDecimalValue(match?.valor, 0);
    }, 0),
  );

  const totalGeneral = rows.reduce((acc, row) => acc + row.total, 0);

  return (
    <div className="vatio-table-wrap">
      <div className="canos-table-title-row">
        <h4>{title}</h4>
        <span className="canos-unit-badge">Unidad: {unit}</span>
      </div>
      <table className="vatio-table canos-resumen-table">
        <colgroup>
          <col className="canos-col-tipo" />
          <col className="canos-col-uso" />
          {DIAMETROS.map((d) => (
            <col key={d} className="canos-col-diametro" />
          ))}
          <col className="canos-col-total" />
        </colgroup>
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Uso</th>
            {DIAMETROS.map((d) => (
              <th key={d}>{d}</th>
            ))}
            <th>Total ({unit})</th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row) => (
              <tr key={`${row.grupo}-${row.uso}`}>
                <td>{row.grupo}</td>
                <td>{row.uso}</td>
                {row.valores.map(({ diametro, valor }) => (
                  <td key={diametro}>{n(valor)}</td>
                ))}
                <td className="canos-row-total">{n(row.total)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={DIAMETROS.length + 3} className="empty-table-cell">
                Sin valores cargados.
              </td>
            </tr>
          )}
        </tbody>
        {rows.length > 0 ? (
          <tfoot>
            <tr className="canos-total-row">
              <td>Total ({unit})</td>
              <td></td>
              {totalsByDiametro.map((valor, index) => (
                <td key={DIAMETROS[index]}>{n(valor)}</td>
              ))}
              <td>{n(totalGeneral)}</td>
            </tr>
          </tfoot>
        ) : null}
      </table>
    </div>
  );
}

export default CanosResumenTable;
