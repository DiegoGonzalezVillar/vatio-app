import { useEffect, useMemo, useState } from "react";
import {
  deletePuestaATierra,
  getPuestaATierra,
  upsertPuestaATierra,
} from "../services/api";
import { PUESTA_TIERRA_ITEMS } from "../utils/vatioConstants";
import { useSaveStatus } from "./useSaveStatus";

const normalizeUnidad = (value) => {
  const raw = String(value || "unid").trim();
  const normalized = raw.toLowerCase();

  if (["m", "metro", "metros", "mts", "mt"].includes(normalized)) return "m";
  if (["unid", "unidad", "unidades", "u", "ud", "uds"].includes(normalized)) return "unid";
  if (["kg", "kilo", "kilos", "kilogramo", "kilogramos"].includes(normalized)) return "kg";
  if (["l", "lt", "lts", "litro", "litros"].includes(normalized)) return "l";
  if (["m2", "m²", "metro cuadrado", "metros cuadrados"].includes(normalized)) return "m2";
  if (["m3", "m³", "metro cubico", "metro cúbico", "metros cubicos", "metros cúbicos"].includes(normalized)) return "m3";
  if (["rollo", "rollos"].includes(normalized)) return "rollo";
  if (["paquete", "paquetes"].includes(normalized)) return "paquete";
  if (["bolsa", "bolsas"].includes(normalized)) return "bolsa";
  if (["caja", "cajas"].includes(normalized)) return "caja";

  return raw || "unid";
};

const BASE_LABELS = {
  conductor_50: "CONDUCTOR DESNUDO 50mm2",
  soldadura: "SOLDADURA EXOTÉRMICA",
  camara_40: "CÁMARA 40X40",
  jabalina_copperweld: "JABALINA TIPO COPPERWELD 5/8'' x 2m",
  jabalina_14mm: "JABALINA 14mm 2m20",
};

const BASE_UNIDADES = {
  conductor_50: "m",
  soldadura: "unid",
  camara_40: "unid",
  jabalina_copperweld: "unid",
  jabalina_14mm: "unid",
};

const baseItems = PUESTA_TIERRA_ITEMS.map((item, index) => ({
  ...item,
  label: BASE_LABELS[item.id] || item.label,
  descripcion: BASE_LABELS[item.id] || item.label,
  unidad: BASE_UNIDADES[item.id] || normalizeUnidad(item.unidad),
  orden: index + 1,
  es_personalizado: false,
}));

const isBaseItem = (itemId) => baseItems.some((base) => base.id === itemId);
const getBaseItem = (itemId) => baseItems.find((base) => base.id === itemId);

const normalizeRow = (row) => {
  const base = getBaseItem(row.item_id);
  const isBase = Boolean(base) && !row.es_personalizado;

  return {
    id: row.item_id,
    item_id: row.item_id,
    descripcion: isBase ? base.label : (row.descripcion || row.label || row.item_id),
    label: isBase ? base.label : (row.descripcion || row.label || row.item_id),
    unidad: normalizeUnidad(isBase ? (row.unidad || base.unidad) : row.unidad),
    cantidad: row.cantidad ?? "",
    orden: isBase ? base.orden : Number(row.orden || 999),
    es_personalizado: Boolean(row.es_personalizado) || !isBaseItem(row.item_id),
  };
};

const buildPayload = (obraId, item) => ({
  obra_id: obraId,
  item_id: item.item_id || item.id,
  descripcion: item.descripcion || item.label || "",
  unidad: normalizeUnidad(item.unidad),
  cantidad: item.cantidad === "" || item.cantidad === null || item.cantidad === undefined ? 0 : item.cantidad,
  orden: item.orden || 999,
  es_personalizado: Boolean(item.es_personalizado),
});

export const usePuestaATierra = (obraId) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const saveStatus = useSaveStatus();

  useEffect(() => {
    if (!obraId) return;
    async function cargar() {
      setLoading(true);
      try {
        const response = await getPuestaATierra(obraId);
        const savedRows = Array.isArray(response) ? response : [];
        const savedById = Object.fromEntries(savedRows.map((row) => [row.item_id, normalizeRow(row)]));

        const mergedBase = baseItems.map((item) => ({
          ...item,
          item_id: item.id,
          cantidad: savedById[item.id]?.cantidad ?? "",
          descripcion: item.label,
          label: item.label,
          unidad: savedById[item.id]?.unidad || item.unidad,
          orden: item.orden,
          es_personalizado: false,
        }));

        const customRows = savedRows
          .map(normalizeRow)
          .filter((row) => row.es_personalizado && !baseItems.some((base) => base.id === row.item_id));

        setRows([...mergedBase, ...customRows].sort((a, b) => Number(a.orden || 999) - Number(b.orden || 999)));
      } catch (error) {
        console.error("No se pudo cargar puesta a tierra", error);
        setRows(baseItems.map((item) => ({ ...item, item_id: item.id, cantidad: "" })));
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, [obraId]);

  const resumenPorUnidad = useMemo(() => {
    return rows.reduce((acc, item) => {
      const cantidad = Number(item.cantidad) || 0;
      if (!cantidad) return acc;
      const unidad = normalizeUnidad(item.unidad);
      acc[unidad] = (acc[unidad] || 0) + cantidad;
      return acc;
    }, {});
  }, [rows]);

  const actualizar = async (itemId, cambios) => {
    const current = rows.find((item) => (item.item_id || item.id) === itemId);
    if (!current || !obraId) return null;

    const nextItem = { ...current, ...cambios };
    setRows((prev) => prev.map((item) => ((item.item_id || item.id) === itemId ? nextItem : item)));

    const saved = await saveStatus.runSave(() => upsertPuestaATierra(buildPayload(obraId, nextItem)));
    const normalized = normalizeRow(saved);
    setRows((prev) => prev.map((item) => ((item.item_id || item.id) === normalized.item_id ? {
      ...item,
      ...normalized,
      id: normalized.item_id,
      item_id: normalized.item_id,
    } : item)));
    return saved;
  };

  const agregarMaterial = async ({ descripcion, unidad, cantidad }) => {
    const cleanDescripcion = String(descripcion || "").trim();
    if (!cleanDescripcion || !obraId) return null;
    const customId = `custom_${Date.now()}`;
    const newItem = {
      id: customId,
      item_id: customId,
      descripcion: cleanDescripcion,
      label: cleanDescripcion,
      unidad: normalizeUnidad(unidad),
      cantidad: cantidad === "" ? 0 : cantidad,
      orden: rows.length + 1,
      es_personalizado: true,
    };
    const saved = await saveStatus.runSave(() => upsertPuestaATierra(buildPayload(obraId, newItem)));
    const normalized = normalizeRow(saved);
    setRows((prev) => [...prev, { ...normalized, id: normalized.item_id }]);
    return saved;
  };

  const eliminarMaterial = async (itemId) => {
    const item = rows.find((row) => (row.item_id || row.id) === itemId);
    if (!item?.es_personalizado || !obraId) return;
    await saveStatus.runSave(() => deletePuestaATierra(itemId));
    setRows((prev) => prev.filter((row) => (row.item_id || row.id) !== itemId));
  };

  return { items: rows, actualizar, agregarMaterial, eliminarMaterial, loading, saveStatus, resumenPorUnidad };
};
