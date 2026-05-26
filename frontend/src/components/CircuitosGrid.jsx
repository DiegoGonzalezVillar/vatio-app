import { formatDecimal } from "../utils/format";
const MEDIDA_COLS = new Set(["x_cano_losa", "caño_losa", "caño_pared", "caño_piso", "cable_metros", "bandeja_metros", "picada_yeso_m", "picada_mamposteria_m", "picada_piso_m", "zanja_m"]);

const fmt = (col, value) => {
  if (value === null || value === undefined || value === "") return "";
  if (col === "detalle_tecnico") return value ? "Detalle" : "";
  if (MEDIDA_COLS.has(col)) return formatDecimal(value, 3);
  return value;
};

function CircuitosGrid({ circuitos, onDelete, onDuplicar, onEditar }) {
  const cols = [
    "numero",
    "tipo_conductor",
    "diametro",
    "x_cano_losa",
    "caño_losa",
    "caño_pared",
    "caño_piso",
    "en_saltos",
    "caja_piso",
    "caja_honda",
    "caja_llana",
    "caja_centro",
    "caja_brazo",
    "bajada_tomas",
    "bajada_tomas_picadas",
    "bajada_luces",
    "bajada_luces_picadas",
    "picada_yeso_m",
    "picada_mamposteria_m",
    "picada_piso_m",
    "zanja_m",
    "codos_especiales",
    "cable_metros",
    "bandeja_metros",
    "conductor",
    "detalle_tecnico",
  ];

  return (
    <div className="vatio-table-wrap">
      <table className="vatio-table">
        <thead>
          <tr>{cols.map((c) => <th key={c}>{c}</th>)}<th>Acciones</th></tr>
        </thead>
        <tbody>
          {circuitos.map((row) => (
            <tr key={row.id}>
              {cols.map((c) => {
                const value = c === "x_cano_losa" ? row[c] ?? row.caño_losa : row[c];
                return <td key={c}>{c === "detalle_tecnico" && value ? <span className="status-pill success">Detalle</span> : fmt(c, value)}</td>;
              })}
              <td className="table-actions">
                <button className="btn-secondary" onClick={() => onEditar(row)}>Editar</button>
                <button className="btn-secondary" onClick={() => onDuplicar(row.id)}>Duplicar</button>
                <button className="btn-ghost" onClick={() => onDelete(row.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default CircuitosGrid;
