import { useMemo, useState } from "react";
import AutoSaveStatus from "../components/AutoSaveStatus";
import { usePuestaATierra } from "../hooks/usePuestaATierra";

const UNIDADES_PUESTA_TIERRA = [
  { value: "m", label: "Metros" },
  { value: "unid", label: "Unidad" },
  { value: "kg", label: "Kilogramos" },
  { value: "l", label: "Litros" },
  { value: "m2", label: "Metros cuadrados" },
  { value: "m3", label: "Metros cúbicos" },
  { value: "rollo", label: "Rollo" },
  { value: "paquete", label: "Paquete" },
  { value: "bolsa", label: "Bolsa" },
  { value: "caja", label: "Caja" },
];

const CUSTOM_UNIT_VALUE = "__custom__";
const standardUnitValues = UNIDADES_PUESTA_TIERRA.map((unidad) => unidad.value);

const getUnitLabel = (value) => {
  const unit = UNIDADES_PUESTA_TIERRA.find((item) => item.value === value);
  return unit?.label || value || "Unidad";
};

function UnidadSelector({ value, onChange }) {
  const isStandard = standardUnitValues.includes(value || "unid");
  const selectValue = isStandard ? (value || "unid") : CUSTOM_UNIT_VALUE;

  return (
    <div className="unidad-selector">
      <select
        value={selectValue}
        onChange={(e) => {
          const nextValue = e.target.value;
          onChange(nextValue === CUSTOM_UNIT_VALUE ? "" : nextValue);
        }}
      >
        {UNIDADES_PUESTA_TIERRA.map((unidad) => (
          <option key={unidad.value} value={unidad.value}>{unidad.label}</option>
        ))}
        <option value={CUSTOM_UNIT_VALUE}>Otra unidad...</option>
      </select>
      {!isStandard && (
        <input
          type="text"
          placeholder="Indicar unidad"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

function PuestaATierraPage({ obra, onBack }) {
  const { items, actualizar, agregarMaterial, loading, saveStatus, resumenPorUnidad } = usePuestaATierra(obra?.id);
  const [nuevo, setNuevo] = useState({ descripcion: "", cantidad: "", unidad: "unid", unidadPersonalizada: "" });

  const unidadNuevo = useMemo(() => {
    if (nuevo.unidad === CUSTOM_UNIT_VALUE) return nuevo.unidadPersonalizada.trim();
    return nuevo.unidad;
  }, [nuevo.unidad, nuevo.unidadPersonalizada]);

  const puedeAgregar = nuevo.descripcion.trim() && nuevo.cantidad !== "" && unidadNuevo;

  const handleAgregar = async (event) => {
    event.preventDefault();
    const saved = await agregarMaterial({
      descripcion: nuevo.descripcion,
      cantidad: nuevo.cantidad,
      unidad: unidadNuevo,
    });
    if (saved) setNuevo({ descripcion: "", cantidad: "", unidad: "unid", unidadPersonalizada: "" });
  };

  return (
    <div className="vatio-module puesta-tierra-module">
      <div className="vatio-module-head">
        <div>
          <p className="eyebrow">A3</p>
          <h3>Puesta a tierra</h3>
          <p>Materiales de puesta a tierra por obra. Incluye los ítems base del Excel y permite agregar filas personalizadas.</p>
        </div>
        <div className="module-actions">
          <AutoSaveStatus {...saveStatus} />
          <button className="btn-secondary" onClick={onBack}>← Volver</button>
        </div>
      </div>

      <form className="puesta-tierra-add" onSubmit={handleAgregar}>
        <div>
          <strong>Agregar material</strong>
          <span>Se guardará como fila adicional de esta obra.</span>
        </div>
        <input
          type="text"
          placeholder="Descripción del material"
          value={nuevo.descripcion}
          onChange={(e) => setNuevo((prev) => ({ ...prev, descripcion: e.target.value }))}
        />
        <input
          type="number"
          step="0.01"
          placeholder="Cantidad"
          value={nuevo.cantidad}
          onChange={(e) => setNuevo((prev) => ({ ...prev, cantidad: e.target.value }))}
        />
        <div className="unidad-selector unidad-selector-add">
          <select value={nuevo.unidad} onChange={(e) => setNuevo((prev) => ({ ...prev, unidad: e.target.value }))}>
            {UNIDADES_PUESTA_TIERRA.map((unidad) => (
              <option key={unidad.value} value={unidad.value}>{unidad.label}</option>
            ))}
            <option value={CUSTOM_UNIT_VALUE}>Otra unidad...</option>
          </select>
          {nuevo.unidad === CUSTOM_UNIT_VALUE && (
            <input
              type="text"
              placeholder="Indicar unidad"
              value={nuevo.unidadPersonalizada}
              onChange={(e) => setNuevo((prev) => ({ ...prev, unidadPersonalizada: e.target.value }))}
            />
          )}
        </div>
        <button className="btn-primary" type="submit" disabled={!puedeAgregar}>+ Agregar</button>
      </form>

      <div className="vatio-table-wrap puesta-tierra-table-wrap">
        <table className="vatio-table puesta-tierra-table">
          <thead>
            <tr>
              <th>Materiales puesta a tierra</th>
              <th>Totales</th>
              <th>Unidad</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="empty-table-cell" colSpan="3">Cargando materiales...</td></tr>
            ) : items.length === 0 ? (
              <tr><td className="empty-table-cell" colSpan="3">Sin materiales cargados.</td></tr>
            ) : items.map((item) => {
              const itemId = item.item_id || item.id;
              return (
                <tr key={itemId}>
                  <td>
                    {item.es_personalizado ? (
                      <input
                        type="text"
                        value={item.descripcion || item.label || ""}
                        onChange={(e) => actualizar(itemId, { descripcion: e.target.value, label: e.target.value })}
                      />
                    ) : (
                      <span className="puesta-tierra-material-name">{item.descripcion || item.label}</span>
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.01"
                      value={item.cantidad ?? ""}
                      onChange={(e) => actualizar(itemId, { cantidad: e.target.value })}
                    />
                  </td>
                  <td>
                    <UnidadSelector value={item.unidad || "unid"} onChange={(unidad) => actualizar(itemId, { unidad })} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {Object.keys(resumenPorUnidad || {}).length > 0 && (
        <div className="puesta-tierra-resumen-unidades">
          {Object.entries(resumenPorUnidad).map(([unidad, total]) => (
            <div key={unidad}>
              <span>{getUnitLabel(unidad)}</span>
              <strong>{Number(total).toLocaleString("es-UY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PuestaATierraPage;
