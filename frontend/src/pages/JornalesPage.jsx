import { useJornales } from "../hooks/useJornales";
function JornalesPage({ onBack }) {
  const j = useJornales();
  return <div className="vatio-module"><div className="vatio-module-head"><div><p className="eyebrow">D1</p><h3>Jornales</h3><p>Referencia global de categorías.</p></div><button className="btn-secondary" onClick={onBack}>← Volver</button></div><p className="vatio-alert">{j.nota}</p><div className="vatio-table-wrap"><table className="vatio-table"><thead><tr><th>Categoría</th><th>Nombre</th><th>Costo hora</th></tr></thead><tbody>{j.categorias.map((c) => <tr key={c.id}><td>{c.id}</td><td>{c.nombre}</td><td>Pendiente de validación</td></tr>)}</tbody></table></div></div>;
}
export default JornalesPage;
