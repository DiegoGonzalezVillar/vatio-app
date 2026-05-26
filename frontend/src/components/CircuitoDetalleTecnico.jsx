import { formatDecimal } from "../utils/format";
import { calcularDetalleTecnicoLegacy } from "../utils/calculosCircuitos";

const emptyDetalle = () => ({ canalizaciones: [] });
const emptyCanalizacion = () => ({
  cano: {
    metros: "",
    instalacion: "1",
    subinstalacion: "",
    yesomuro: "",
    picadazanja: false,
  },
  canoBajada: [],
});
const emptyBajada = () => ({
  tipoBajada: "1",
  cantidad: "",
  material: "0",
  picadas: "",
  cantCodos: "",
});

const parseDetalle = (value) => {
  if (!value) return null;
  if (typeof value === "string") {
    try { return JSON.parse(value); } catch { return null; }
  }
  return value;
};

const normalizeDetalle = (value) => {
  const detalle = parseDetalle(value) || emptyDetalle();
  const canalizaciones = Array.isArray(detalle.canalizaciones) ? detalle.canalizaciones : [];
  return {
    ...detalle,
    canalizaciones: canalizaciones.map((c) => ({
      ...c,
      cano: {
        ...emptyCanalizacion().cano,
        ...(c?.cano || c || {}),
      },
      canoBajada: Array.isArray(c?.canoBajada) ? c.canoBajada : [],
    })),
  };
};

const instalacionOptions = [
  { value: "1", label: "Losa / cielorraso" },
  { value: "4", label: "Pared" },
  { value: "5", label: "Piso" },
];

const subinstalacionOptions = (instalacion) => {
  if (String(instalacion) === "4") {
    return [
      { value: "", label: "Sin picada" },
      { value: "6", label: "Pared con yeso/mampostería" },
    ];
  }
  if (String(instalacion) === "5") {
    return [
      { value: "", label: "Sin picada" },
      { value: "1", label: "Picada piso / contrapiso" },
      { value: "2", label: "Zanja" },
    ];
  }
  return [
    { value: "", label: "Sin picada" },
    { value: "3", label: "Picada yeso horizontal" },
  ];
};

const bajadaTipoOptions = [
  { value: "1", label: "Luces" },
  { value: "2", label: "Tomas" },
  { value: "3", label: "Brazo" },
  { value: "4", label: "Especial" },
];

const materialPicadaOptions = [
  { value: "0", label: "Sin picada" },
  { value: "2", label: "Yeso" },
  { value: "1", label: "Mampostería / ladrillo" },
];

function resumenCanalizacion(canalizacion, tablero) {
  return calcularDetalleTecnicoLegacy({ canalizaciones: [canalizacion] }, tablero);
}

function CircuitoDetalleTecnico({ value, tablero, onChange }) {
  const detalle = normalizeDetalle(value);
  const activo = Boolean(value && detalle.canalizaciones.length >= 0);
  const resumen = calcularDetalleTecnicoLegacy(detalle, tablero);

  const emit = (next) => onChange?.(next);

  const activar = () => emit(emptyDetalle());
  const desactivar = () => emit(null);

  const addCanalizacion = () => {
    emit({ ...detalle, canalizaciones: [...detalle.canalizaciones, emptyCanalizacion()] });
  };

  const updateCanalizacion = (index, patch) => {
    const canalizaciones = detalle.canalizaciones.map((canalizacion, i) => {
      if (i !== index) return canalizacion;
      return { ...canalizacion, ...patch };
    });
    emit({ ...detalle, canalizaciones });
  };

  const updateCano = (index, field, rawValue) => {
    const canalizacion = detalle.canalizaciones[index];
    const cano = { ...(canalizacion?.cano || {}), [field]: rawValue };

    if (field === "instalacion") {
      cano.subinstalacion = "";
      cano.yesomuro = "";
      cano.picadazanja = false;
    }

    if (field === "subinstalacion") {
      if (["1", "2"].includes(String(rawValue))) cano.picadazanja = true;
      if (String(rawValue) !== "6") cano.yesomuro = "";
    }

    updateCanalizacion(index, { cano });
  };

  const removeCanalizacion = (index) => {
    emit({ ...detalle, canalizaciones: detalle.canalizaciones.filter((_, i) => i !== index) });
  };

  const duplicarCanalizacion = (index) => {
    const origen = detalle.canalizaciones[index];
    if (!origen) return;
    const copia = JSON.parse(JSON.stringify(origen));
    emit({
      ...detalle,
      canalizaciones: [
        ...detalle.canalizaciones.slice(0, index + 1),
        copia,
        ...detalle.canalizaciones.slice(index + 1),
      ],
    });
  };

  const addBajada = (canalIndex) => {
    const canalizacion = detalle.canalizaciones[canalIndex];
    updateCanalizacion(canalIndex, {
      canoBajada: [...(canalizacion.canoBajada || []), emptyBajada()],
    });
  };

  const updateBajada = (canalIndex, bajadaIndex, field, rawValue) => {
    const canalizacion = detalle.canalizaciones[canalIndex];
    const canoBajada = (canalizacion.canoBajada || []).map((bajada, i) => (
      i === bajadaIndex ? { ...bajada, [field]: rawValue } : bajada
    ));
    updateCanalizacion(canalIndex, { canoBajada });
  };

  const removeBajada = (canalIndex, bajadaIndex) => {
    const canalizacion = detalle.canalizaciones[canalIndex];
    updateCanalizacion(canalIndex, {
      canoBajada: (canalizacion.canoBajada || []).filter((_, i) => i !== bajadaIndex),
    });
  };

  if (!activo) {
    return (
      <div className="detalle-tecnico-card compact">
        <div>
          <strong>Detalle técnico de circuito</strong>
          <p>Permite cargar canalizaciones, bajadas, picadas y zanja con la lógica de la web vieja.</p>
        </div>
        <button type="button" className="btn-secondary" onClick={activar}>+ Usar detalle técnico</button>
      </div>
    );
  }

  return (
    <div className="detalle-tecnico-card">
      <div className="detalle-tecnico-head">
        <div>
          <strong>Detalle técnico de circuito</strong>
          <p>Si está activo, los cálculos derivados salen de este detalle y no de la carga simplificada.</p>
        </div>
        <div className="detalle-actions">
          <button type="button" className="btn-secondary" onClick={addCanalizacion}>+ Canalización</button>
          <button type="button" className="btn-ghost" onClick={desactivar}>Quitar detalle</button>
        </div>
      </div>

      <div className="detalle-kpis">
        <span>Caño losa <strong>{formatDecimal(resumen.caño_losa, 3)}</strong></span>
        <span>Caño pared <strong>{formatDecimal(resumen.caño_pared + resumen.caño_pared_bajadas_m, 3)}</strong></span>
        <span>Caño piso <strong>{formatDecimal(resumen.caño_piso, 3)}</strong></span>
        <span>Cable <strong>{formatDecimal(resumen.cable_horizontal_m + resumen.cable_bajadas_m, 3)}</strong></span>
        <span>Yeso <strong>{formatDecimal(resumen.picada_yeso_m, 3)}</strong></span>
        <span>Mampostería <strong>{formatDecimal(resumen.picada_mamposteria_m, 3)}</strong></span>
        <span>Picada piso <strong>{formatDecimal(resumen.picada_piso_m, 3)}</strong></span>
        <span>Zanja <strong>{formatDecimal(resumen.zanja_m, 3)}</strong></span>
      </div>

      {detalle.canalizaciones.length === 0 && (
        <div className="empty-inline">Sin canalizaciones detalladas. Agregá una para calcular con la lógica completa.</div>
      )}

      {detalle.canalizaciones.map((canalizacion, canalIndex) => {
        const cano = canalizacion.cano || {};
        return (
          <div className="canalizacion-block" key={`canal-${canalIndex}`}>
            <div className="canalizacion-title">
              <strong>Canalización #{canalIndex + 1}</strong>
              <div className="detalle-actions mini">
                <button type="button" className="btn-secondary small" onClick={() => duplicarCanalizacion(canalIndex)}>Duplicar</button>
                <button type="button" className="btn-ghost" onClick={() => removeCanalizacion(canalIndex)}>Eliminar</button>
              </div>
            </div>

            <div className="detalle-grid detalle-grid-cano">
              <label>
                <span>Metros</span>
                <input inputMode="decimal" value={cano.metros ?? ""} onChange={(e) => updateCano(canalIndex, "metros", e.target.value)} placeholder="0,00" />
              </label>
              <label>
                <span>Instalación</span>
                <select value={cano.instalacion ?? "1"} onChange={(e) => updateCano(canalIndex, "instalacion", e.target.value)}>
                  {instalacionOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </label>
              <label>
                <span>Picada / condición</span>
                <select value={cano.subinstalacion ?? ""} onChange={(e) => updateCano(canalIndex, "subinstalacion", e.target.value)}>
                  {subinstalacionOptions(cano.instalacion).map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </label>
              {String(cano.subinstalacion) === "6" && (
                <label>
                  <span>Material pared</span>
                  <select value={cano.yesomuro ?? ""} onChange={(e) => updateCano(canalIndex, "yesomuro", e.target.value)}>
                    <option value="">Seleccionar</option>
                    <option value="yeso">Yeso</option>
                    <option value="mamposteria">Mampostería</option>
                  </select>
                </label>
              )}
            </div>

            {(() => {
              const parcial = resumenCanalizacion(canalizacion, tablero);
              return (
                <div className="detalle-kpis detalle-kpis-small">
                  <span>Losa <strong>{formatDecimal(parcial.caño_losa, 3)}</strong></span>
                  <span>Pared <strong>{formatDecimal(parcial.caño_pared + parcial.caño_pared_bajadas_m, 3)}</strong></span>
                  <span>Piso <strong>{formatDecimal(parcial.caño_piso, 3)}</strong></span>
                  <span>Cable <strong>{formatDecimal(parcial.cable_horizontal_m + parcial.cable_bajadas_m, 3)}</strong></span>
                  <span>Yeso <strong>{formatDecimal(parcial.picada_yeso_m, 3)}</strong></span>
                  <span>Mamp. <strong>{formatDecimal(parcial.picada_mamposteria_m, 3)}</strong></span>
                </div>
              );
            })()}

            <div className="bajadas-head">
              <strong>Bajadas asociadas</strong>
              <button type="button" className="btn-secondary small" onClick={() => addBajada(canalIndex)}>+ Bajada</button>
            </div>

            {(canalizacion.canoBajada || []).length === 0 ? (
              <div className="empty-inline slim">Sin bajadas en esta canalización.</div>
            ) : (
              <div className="vatio-table-wrap detalle-table-wrap">
                <table className="vatio-table detalle-table">
                  <thead>
                    <tr>
                      <th>Tipo</th>
                      <th>Cantidad</th>
                      <th>Material picada</th>
                      <th>Picadas</th>
                      <th>Codos</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {(canalizacion.canoBajada || []).map((bajada, bajadaIndex) => (
                      <tr key={`bajada-${canalIndex}-${bajadaIndex}`}>
                        <td>
                          <select value={bajada.tipoBajada ?? "1"} onChange={(e) => updateBajada(canalIndex, bajadaIndex, "tipoBajada", e.target.value)}>
                            {bajadaTipoOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                          </select>
                        </td>
                        <td><input inputMode="decimal" value={bajada.cantidad ?? ""} onChange={(e) => updateBajada(canalIndex, bajadaIndex, "cantidad", e.target.value)} /></td>
                        <td>
                          <select value={bajada.material ?? "0"} onChange={(e) => updateBajada(canalIndex, bajadaIndex, "material", e.target.value)}>
                            {materialPicadaOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                          </select>
                        </td>
                        <td><input inputMode="decimal" value={bajada.picadas ?? ""} onChange={(e) => updateBajada(canalIndex, bajadaIndex, "picadas", e.target.value)} /></td>
                        <td><input inputMode="decimal" value={bajada.cantCodos ?? ""} onChange={(e) => updateBajada(canalIndex, bajadaIndex, "cantCodos", e.target.value)} /></td>
                        <td><button type="button" className="btn-ghost" onClick={() => removeBajada(canalIndex, bajadaIndex)}>Eliminar</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default CircuitoDetalleTecnico;
