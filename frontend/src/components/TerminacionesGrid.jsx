function TerminacionesGrid({ tableros, items, valor, actualizarCantidad }) {
  return <div className="vatio-table-wrap"><table className="vatio-table"><thead><tr><th>Tipo caja</th><th>Ítem</th>{tableros.map((t) => <th key={`${t.id}-p`}>{t.nombre} Plástico</th>)}{tableros.map((t) => <th key={`${t.id}-m`}>{t.nombre} Metal</th>)}<th>Total</th></tr></thead><tbody>{items.map((it) => {
    if (it.titulo) return <tr key={`titulo-${it.titulo}`} className="vatio-row-title"><td colSpan={3 + tableros.length * 2}>{it.titulo}</td></tr>;
    const total = tableros.reduce((s, t) => s + valor(it.item, t.id, "PLASTICO") + valor(it.item, t.id, "METAL"), 0);
    return <tr key={`${it.tipo_caja}-${it.item}`}><td>{it.tipo_caja}</td><td>{it.item}</td>{tableros.map((t) => <td key={`${it.item}-${t.id}-p`}><input type="number" value={valor(it.item, t.id, "PLASTICO")} onChange={(e) => actualizarCantidad(it.item, it.tipo_caja, t.id, "PLASTICO", e.target.value)} /></td>)}{tableros.map((t) => <td key={`${it.item}-${t.id}-m`}><input type="number" value={valor(it.item, t.id, "METAL")} onChange={(e) => actualizarCantidad(it.item, it.tipo_caja, t.id, "METAL", e.target.value)} /></td>)}<td>{total}</td></tr>;
  })}</tbody></table></div>;
}
export default TerminacionesGrid;
