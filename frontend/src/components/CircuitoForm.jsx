import { useEffect, useMemo, useState } from "react";
import { CONDUCTORES_POR_TIPO, DIAMETROS_POR_TIPO, TIPOS_CONDUCTOR_CANALIZACION } from "../utils/vatioConstants";
import { calcularDatosDerivadosCircuito, prepararCircuitoParaGuardar } from "../utils/calculosCircuitos";
import { formatDecimal } from "../utils/format";
import CircuitoDetalleTecnico from "./CircuitoDetalleTecnico";

const initial = {
  numero: "",
  tipo_conductor: "CORRUGADO",
  diametro: "Ø20",
  x_cano_losa: "",
  en_saltos: "",
  caja_piso: "",
  caja_honda: "",
  caja_llana: "",
  caja_centro: "",
  caja_brazo: "",
  bajada_tomas: "",
  bajada_tomas_picadas: "",
  bajada_luces: "",
  bajada_luces_picadas: "",
  codos_especiales: "",
  bandeja_metros: "",
  picada_piso_m: "",
  zanja_m: "",
  detalle_tecnico: null,
  conductor: "",
  incluye_bajada_tablero: true,
  conductor_metros: "",
  conductor_cantidad: 1,
  conductor_bandeja: "",
  conductor_bandeja_metros: "",
  conductor_bandeja_cantidad: "",
  codos_pvc: "",
  codos_galvanizado: "",
  uniones_pvc: "",
  uniones_galvanizado: "",
  uniones_bandeja: "",
};

const CAMPOS_ENTRADA = [
  ["x_cano_losa", "x caño en losa"],
  ["en_saltos", "en saltos x pared"],
  ["caja_piso", "caja piso"],
  ["caja_honda", "caja honda"],
  ["bajada_tomas", "bajada tomas"],
  ["bajada_tomas_picadas", "bajada tomas picadas"],
  ["caja_llana", "caja llana"],
  ["caja_centro", "centro"],
  ["caja_brazo", "brazo"],
  ["bajada_luces", "bajada luces"],
  ["bajada_luces_picadas", "bajada luces picadas"],
  ["codos_especiales", "codos especiales"],
  ["bandeja_metros", "bandeja"],
  ["picada_piso_m", "picada piso/contrapiso"],
  ["zanja_m", "zanja"],
];

const normalizarCircuitoParaFormulario = (circuito) => {
  if (!circuito) return initial;

  return {
    ...initial,
    numero: circuito.numero ?? "",
    tipo_conductor: circuito.tipo_conductor ?? "CORRUGADO",
    diametro: circuito.diametro ?? "Ø20",
    // Para registros viejos que no tenían x_cano_losa, usamos caño_losa como respaldo.
    x_cano_losa: circuito.x_cano_losa ?? circuito.caño_losa ?? "",
    en_saltos: circuito.en_saltos ?? "",
    caja_piso: circuito.caja_piso ?? "",
    caja_honda: circuito.caja_honda ?? "",
    caja_llana: circuito.caja_llana ?? "",
    caja_centro: circuito.caja_centro ?? "",
    caja_brazo: circuito.caja_brazo ?? "",
    bajada_tomas: circuito.bajada_tomas ?? "",
    bajada_tomas_picadas: circuito.bajada_tomas_picadas ?? "",
    bajada_luces: circuito.bajada_luces ?? "",
    bajada_luces_picadas: circuito.bajada_luces_picadas ?? "",
    codos_especiales: circuito.codos_especiales ?? "",
    bandeja_metros: circuito.bandeja_metros ?? "",
    picada_piso_m: circuito.picada_piso_m ?? "",
    zanja_m: circuito.zanja_m ?? "",
    detalle_tecnico: circuito.detalle_tecnico ?? null,
    conductor: circuito.conductor ?? "",
    incluye_bajada_tablero: circuito.incluye_bajada_tablero !== false,
    conductor_metros: circuito.conductor_metros ?? "",
    conductor_cantidad: circuito.conductor_cantidad ?? 1,
    conductor_bandeja: circuito.conductor_bandeja ?? "",
    conductor_bandeja_metros: circuito.conductor_bandeja_metros ?? "",
    conductor_bandeja_cantidad: circuito.conductor_bandeja_cantidad ?? "",
    codos_pvc: circuito.codos_pvc ?? "",
    codos_galvanizado: circuito.codos_galvanizado ?? "",
    uniones_pvc: circuito.uniones_pvc ?? "",
    uniones_galvanizado: circuito.uniones_galvanizado ?? "",
    uniones_bandeja: circuito.uniones_bandeja ?? "",
  };
};

function CircuitoForm({ tipo, tablero, onSubmit, editingCircuito, onCancelEdit }) {
  const [form, setForm] = useState(initial);
  const isEditing = Boolean(editingCircuito?.id);
  const conductores = CONDUCTORES_POR_TIPO[tipo] || CONDUCTORES_POR_TIPO.electrica;
  const diametros = useMemo(() => DIAMETROS_POR_TIPO[form.tipo_conductor] || [], [form.tipo_conductor]);
  const derivados = useMemo(() => calcularDatosDerivadosCircuito(form, tablero), [form, tablero]);
  const detalleActivo = Boolean(form.detalle_tecnico);
  const [mostrarCargaRapida, setMostrarCargaRapida] = useState(false);
  const set = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  useEffect(() => {
    const next = normalizarCircuitoParaFormulario(editingCircuito);
    setForm(next);
    setMostrarCargaRapida(!next.detalle_tecnico);
  }, [editingCircuito?.id]);

  useEffect(() => {
    if (diametros.length && !diametros.includes(form.diametro)) {
      set("diametro", diametros[0]);
    }
  }, [diametros, form.diametro]);

  const guardar = async (e) => {
    e.preventDefault();
    await onSubmit(prepararCircuitoParaGuardar(form, tablero));
    setForm({ ...initial, incluye_bajada_tablero: true });
  };

  const cancelar = () => {
    setForm({ ...initial, incluye_bajada_tablero: true });
    onCancelEdit?.();
  };

  return (
    <form className="vatio-form" onSubmit={guardar}>
      {isEditing && (
        <div className="form-banner">
          <strong>Editando circuito {editingCircuito.numero || `#${editingCircuito.id}`}</strong>
          <span>Al guardar se recalculan caño losa, caño pared, cable y picadas según la lógica del Excel/web vieja.</span>
        </div>
      )}

      <input placeholder="Nro. circuito" value={form.numero} onChange={(e) => set("numero", e.target.value)} />
      <select value={form.tipo_conductor} onChange={(e) => set("tipo_conductor", e.target.value)}>{TIPOS_CONDUCTOR_CANALIZACION.map((t) => <option key={t}>{t}</option>)}</select>
      <select value={form.diametro} onChange={(e) => set("diametro", e.target.value)}>{diametros.map((d) => <option key={d}>{d}</option>)}</select>
      <select value={form.conductor} onChange={(e) => set("conductor", e.target.value)}><option value="">Conductor</option>{conductores.map((c) => <option key={c}>{c}</option>)}</select>

      <label className="checkbox-field">
        <span>Incluir bajada a tablero</span>
        <input
          type="checkbox"
          checked={form.incluye_bajada_tablero}
          onChange={(e) => set("incluye_bajada_tablero", e.target.checked)}
        />
      </label>

      <div className="form-full-row carga-rapida-panel">
        <div className="carga-rapida-head">
          <div>
            <strong>Carga rápida / valores manuales</strong>
            <p>{detalleActivo ? "El detalle técnico está activo: al guardar, estos valores derivados se reemplazan por el cálculo detallado." : "Usá estos campos para la carga simple del circuito."}</p>
          </div>
          <button type="button" className="btn-secondary small" onClick={() => setMostrarCargaRapida((v) => !v)}>
            {mostrarCargaRapida ? "Ocultar" : "Mostrar"}
          </button>
        </div>
        {mostrarCargaRapida && (
          <div className="carga-rapida-grid">
            {CAMPOS_ENTRADA.map(([name, label]) => (
              <input key={name} inputMode="decimal" placeholder={label} value={form[name]} onChange={(e) => set(name, e.target.value)} />
            ))}
          </div>
        )}
      </div>

      <div className="form-full-row carga-rapida-panel">
        <div className="carga-rapida-head">
          <div>
            <strong>Conductores y accesorios</strong>
            <p>Permite separar metros/cantidad de conductor y discriminar codos/uniones para el resumen contra Excel.</p>
          </div>
        </div>
        <div className="carga-rapida-grid">
          <input inputMode="decimal" placeholder="metros conductor" value={form.conductor_metros} onChange={(e) => set("conductor_metros", e.target.value)} />
          <input inputMode="decimal" placeholder="cantidad conductor" value={form.conductor_cantidad} onChange={(e) => set("conductor_cantidad", e.target.value)} />
          <input inputMode="decimal" placeholder="metros conductor bandeja" value={form.conductor_bandeja_metros} onChange={(e) => set("conductor_bandeja_metros", e.target.value)} />
          <input inputMode="decimal" placeholder="cantidad conductor bandeja" value={form.conductor_bandeja_cantidad} onChange={(e) => set("conductor_bandeja_cantidad", e.target.value)} />
          <input inputMode="decimal" placeholder="codos PVC" value={form.codos_pvc} onChange={(e) => set("codos_pvc", e.target.value)} />
          <input inputMode="decimal" placeholder="codos galvanizado" value={form.codos_galvanizado} onChange={(e) => set("codos_galvanizado", e.target.value)} />
          <input inputMode="decimal" placeholder="uniones PVC" value={form.uniones_pvc} onChange={(e) => set("uniones_pvc", e.target.value)} />
          <input inputMode="decimal" placeholder="uniones galvanizado" value={form.uniones_galvanizado} onChange={(e) => set("uniones_galvanizado", e.target.value)} />
          <input inputMode="decimal" placeholder="uniones bandeja" value={form.uniones_bandeja} onChange={(e) => set("uniones_bandeja", e.target.value)} />
        </div>
      </div>

      <div className="calc-preview"><span>Caño losa</span><strong>{formatDecimal(derivados.caño_losa, 3)}</strong></div>
      <div className="calc-preview"><span>Caño pared</span><strong>{formatDecimal(derivados.caño_pared, 3)}</strong></div>
      <div className="calc-preview"><span>Cable m</span><strong>{formatDecimal(derivados.cable_metros, 3)}</strong></div>
      <div className="calc-preview"><span>Picada yeso m</span><strong>{formatDecimal(derivados.picada_yeso_m, 3)}</strong></div>
      <div className="calc-preview"><span>Picada mamp. m</span><strong>{formatDecimal(derivados.picada_mamposteria_m, 3)}</strong></div>
      <div className="form-full-row">
        <CircuitoDetalleTecnico
          value={form.detalle_tecnico}
          tablero={tablero}
          onChange={(detalle) => set("detalle_tecnico", detalle)}
        />
      </div>
      <button className="btn-primary" type="submit">{isEditing ? "Guardar cambios" : "Agregar circuito"}</button>
      {isEditing && <button className="btn-secondary" type="button" onClick={cancelar}>Cancelar edición</button>}
    </form>
  );
}
export default CircuitoForm;
