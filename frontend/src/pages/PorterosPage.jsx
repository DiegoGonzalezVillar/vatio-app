import { useState } from "react";
import AutoSaveStatus from "../components/AutoSaveStatus";
import { usePorteros } from "../hooks/usePorteros";

function PorterosPage({ obra, onBack }) {
  const p = usePorteros(obra?.id);
  const [form, setForm] = useState({ cant: "", descripcion: "", precio: "", proveedor: "" });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const guardar = async (e) => {
    e.preventDefault();
    await p.agregarItem(form);
    setForm({ cant: "", descripcion: "", precio: "", proveedor: "" });
  };

  return (
    <div className="vatio-module">
      <div className="vatio-module-head">
        <div>
          <p className="eyebrow">Porteros</p>
          <h3>Materiales de portero</h3>
          <p>Lista simple con cantidad, precio, subtotal y proveedor.</p>
        </div>
        <div className="module-actions">
          <AutoSaveStatus {...p.saveStatus} />
          <button className="btn-secondary" onClick={onBack}>← Volver</button>
        </div>
      </div>

      <form className="vatio-form" onSubmit={guardar}>
        <input type="number" placeholder="cant" value={form.cant} onChange={(e) => set("cant", e.target.value)} />
        <input placeholder="descripción" value={form.descripcion} onChange={(e) => set("descripcion", e.target.value)} />
        <input type="number" step="0.01" placeholder="precio" value={form.precio} onChange={(e) => set("precio", e.target.value)} />
        <input placeholder="proveedor" value={form.proveedor} onChange={(e) => set("proveedor", e.target.value)} />
        <button className="btn-primary">Agregar</button>
      </form>

      <div className="vatio-table-wrap">
        <table className="vatio-table">
          <thead><tr><th>Cant.</th><th>Descripción</th><th>Precio</th><th>Subtotal</th><th>Proveedor</th><th></th></tr></thead>
          <tbody>
            {p.items.map((item) => (
              <tr key={item.id}>
                <td>{item.cant}</td>
                <td>{item.descripcion}</td>
                <td>{item.precio}</td>
                <td>{p.subtotal(item).toFixed(2)}</td>
                <td>{item.proveedor}</td>
                <td><button className="btn-ghost" onClick={() => p.eliminarItem(item.id)}>Eliminar</button></td>
              </tr>
            ))}
          </tbody>
          <tfoot><tr><td colSpan="3">Total</td><td>{p.total.toFixed(2)}</td><td colSpan="2"></td></tr></tfoot>
        </table>
      </div>
    </div>
  );
}

export default PorterosPage;
