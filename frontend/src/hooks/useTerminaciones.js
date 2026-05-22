import { useEffect, useMemo, useState } from "react";
import {
  createTerminacionCatalogo,
  deleteTerminacionCatalogo,
  getTableros,
  getTerminaciones,
  getTerminacionesCatalogo,
  updateTerminacionCatalogo,
  upsertTerminacion,
} from "../services/api";
import { TERMINACIONES_DEBILES, TERMINACIONES_ELECTRICA, TIPOS_CAJA_TERMINACIONES } from "../utils/vatioConstants";
import { useSaveStatus } from "./useSaveStatus";

const n = (v) => Number(v || 0);

const GRUPO_POR_TIPO_CAJA = {
  CAMARA: "CÁMARAS",
  LLANA: "CAJA LLANA",
  HONDA: "CAJA HONDA",
  CENTRO: "CAJA CENTRO",
  BRAZO: "CAJA BRAZO",
  REGISTRO: "REGISTROS",
  OTROS: "OTROS",
};

const agregarItemsHistoricosDesdeRegistros = (items, registros) => {
  const existentes = new Set(items.filter((item) => !item.titulo).map((item) => `${String(item.tipo_caja || "").toUpperCase()}::${String(item.item || "").toUpperCase()}`));
  const salida = [...items];
  const gruposExistentes = new Set(items.filter((item) => item.titulo).map((item) => String(item.titulo || "").toUpperCase()));

  registros
    .filter((r) => n(r.cantidad) > 0)
    .forEach((r) => {
      const tipoCaja = String(r.tipo_caja || "OTROS").toUpperCase();
      const item = String(r.item || "").trim();
      if (!item) return;
      const key = `${tipoCaja}::${item.toUpperCase()}`;
      if (existentes.has(key)) return;

      const grupo = GRUPO_POR_TIPO_CAJA[tipoCaja] || tipoCaja || "OTROS";
      if (!gruposExistentes.has(grupo)) {
        salida.push({ titulo: grupo });
        gruposExistentes.add(grupo);
      }
      salida.push({
        item,
        tipo_caja: tipoCaja,
        grupo,
        materiales: String(r.material || "").toUpperCase() === "GENERAL" ? ["GENERAL"] : undefined,
        personalizado: true,
        eliminado: true,
      });
      existentes.add(key);
    });

  return salida;
};

const itemsBasePorTipo = (tipo) => (tipo === "debiles" ? TERMINACIONES_DEBILES : TERMINACIONES_ELECTRICA);

const normalizarCatalogoItem = (row) => ({
  id: row.id,
  item: row.item,
  tipo_caja: row.tipo_caja,
  grupo: row.grupo,
  materiales: Array.isArray(row.materiales) ? row.materiales : undefined,
  personalizado: true,
});

const mezclarItemsConCatalogo = (baseItems, catalogoItems) => {
  if (!catalogoItems?.length) return baseItems;

  const porGrupo = catalogoItems.reduce((acc, item) => {
    const grupo = String(item.grupo || item.tipo_caja || "OTROS").toUpperCase();
    if (!acc[grupo]) acc[grupo] = [];
    acc[grupo].push(normalizarCatalogoItem(item));
    return acc;
  }, {});

  const salida = [];
  const gruposInsertados = new Set();
  let grupoActual = null;

  baseItems.forEach((item, index) => {
    if (item.titulo) {
      grupoActual = String(item.titulo || "").toUpperCase();
      salida.push(item);
      return;
    }

    salida.push(item);

    const next = baseItems[index + 1];
    const terminaGrupo = !next || next.titulo;
    if (terminaGrupo && grupoActual && porGrupo[grupoActual]) {
      porGrupo[grupoActual].forEach((extra) => salida.push(extra));
      gruposInsertados.add(grupoActual);
    }
  });

  Object.entries(porGrupo).forEach(([grupo, extras]) => {
    if (gruposInsertados.has(grupo)) return;
    salida.push({ titulo: grupo });
    extras.forEach((extra) => salida.push(extra));
  });

  return salida;
};

const crearResumenVacio = () => TIPOS_CAJA_TERMINACIONES.reduce((acc, tipoCaja) => {
  acc[tipoCaja.toLowerCase()] = { plastico: 0, metal: 0, general: 0, total: 0 };
  return acc;
}, {});

const sumarRegistro = (acc, registro) => {
  const key = String(registro.tipo_caja || "OTROS").toLowerCase();
  const material = String(registro.material || "GENERAL").toUpperCase();
  const cantidad = n(registro.cantidad);
  if (!acc[key]) acc[key] = { plastico: 0, metal: 0, general: 0, total: 0 };
  if (material === "PLASTICO") acc[key].plastico += cantidad;
  else if (material === "METAL") acc[key].metal += cantidad;
  else acc[key].general += cantidad;
  acc[key].total += cantidad;
};

export const useTerminaciones = (obraId, tipo) => {
  const [tableros, setTableros] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [catalogoPersonalizado, setCatalogoPersonalizado] = useState([]);
  const [loading, setLoading] = useState(false);
  const saveStatus = useSaveStatus();

  const items = useMemo(
    () => agregarItemsHistoricosDesdeRegistros(mezclarItemsConCatalogo(itemsBasePorTipo(tipo), catalogoPersonalizado), registros),
    [tipo, catalogoPersonalizado, registros]
  );

  const cargar = async () => {
    if (!obraId || !tipo) return;
    setLoading(true);
    try {
      const [tabs, terms, catalogo] = await Promise.all([
        getTableros(obraId),
        getTerminaciones(obraId, tipo),
        getTerminacionesCatalogo(tipo),
      ]);
      setTableros(tabs);
      setRegistros(terms);
      setCatalogoPersonalizado(catalogo);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, [obraId, tipo]);

  const valor = (item, tableroId, material) => n(registros.find((r) => r.item === item && Number(r.tablero_id) === Number(tableroId) && String(r.material || "").toUpperCase() === material)?.cantidad);

  const totalesPorTablero = (tableroId) => {
    const acc = crearResumenVacio();
    registros
      .filter((r) => Number(r.tablero_id) === Number(tableroId))
      .forEach((r) => sumarRegistro(acc, r));
    return acc;
  };

  const totalesGlobales = useMemo(() => {
    const acc = crearResumenVacio();
    registros.forEach((r) => sumarRegistro(acc, r));
    return acc;
  }, [registros]);

  const actualizarCantidad = async (item, tipo_caja, tableroId, material, cantidad) => {
    const registro = await saveStatus.runSave(() => upsertTerminacion({ obra_id: obraId, tipo, tablero_id: tableroId, item, tipo_caja, material, cantidad }));
    setRegistros((prev) => {
      const sinActual = prev.filter((r) => !(r.item === item && Number(r.tablero_id) === Number(tableroId) && String(r.material || "").toUpperCase() === material));
      return [registro, ...sinActual];
    });
  };

  const agregarItemCatalogo = async ({ grupo, tipo_caja, item, materiales }) => {
    const nuevo = await saveStatus.runSave(() => createTerminacionCatalogo(tipo, { grupo, tipo_caja, item, materiales }));
    setCatalogoPersonalizado((prev) => {
      const sinActual = prev.filter((x) => !(String(x.grupo).toUpperCase() === String(nuevo.grupo).toUpperCase() && String(x.tipo_caja).toUpperCase() === String(nuevo.tipo_caja).toUpperCase() && String(x.item).toUpperCase() === String(nuevo.item).toUpperCase()));
      return [...sinActual, nuevo];
    });
    return nuevo;
  };

  const editarItemCatalogo = async ({ id, item, grupo, tipo_caja }) => {
    const actualizado = await saveStatus.runSave(() => updateTerminacionCatalogo(tipo, id, { item, grupo, tipo_caja }));
    setCatalogoPersonalizado((prev) => prev.map((x) => (Number(x.id) === Number(id) ? actualizado : x)));
    setRegistros((prev) => prev.map((r) => {
      const actual = catalogoPersonalizado.find((x) => Number(x.id) === Number(id));
      if (!actual) return r;
      const mismoItem = r.item === actual.item && String(r.tipo_caja || "").toUpperCase() === String(actual.tipo_caja || "").toUpperCase();
      return mismoItem ? { ...r, item: actualizado.item, tipo_caja: actualizado.tipo_caja } : r;
    }));
    return actualizado;
  };

  const eliminarItemCatalogo = async ({ id }) => {
    const actual = catalogoPersonalizado.find((x) => Number(x.id) === Number(id));
    await saveStatus.runSave(() => deleteTerminacionCatalogo(tipo, id));
    setCatalogoPersonalizado((prev) => prev.filter((x) => Number(x.id) !== Number(id)));

    // Si el ítem tenía cantidades cargadas en la obra actual, lo dejamos visible como
    // personalizado histórico para que el usuario no pierda la referencia en esta obra.
    if (actual) {
      const tieneRegistrosEnObra = registros.some((r) => r.item === actual.item && String(r.tipo_caja || "").toUpperCase() === String(actual.tipo_caja || "").toUpperCase() && n(r.cantidad) > 0);
      if (tieneRegistrosEnObra) {
        setCatalogoPersonalizado((prev) => [...prev, { ...actual, activo: false, eliminado: true }]);
      }
    }
  };

  return {
    tableros,
    items,
    registros,
    valor,
    totalesPorTablero,
    totalesGlobales,
    actualizarCantidad,
    agregarItemCatalogo,
    editarItemCatalogo,
    eliminarItemCatalogo,
    cargar,
    loading,
    saveStatus,
  };
};
