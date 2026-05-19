import { useEffect, useMemo, useState } from "react";
import { getBandejas, upsertBandeja } from "../services/api";
import { CAMPOS_BANDEJA } from "../utils/vatioConstants";
import { parseDecimalValue } from "../utils/format";
import { useSaveStatus } from "./useSaveStatus";

const NUMERIC_FIELDS = CAMPOS_BANDEJA.filter((campo) => campo !== "tapa");
const ACCESSORY_FIELDS = NUMERIC_FIELDS.filter((campo) => campo !== "metraje");

const n = (value) => parseDecimalValue(value, 0);

const normalizarTapa = (value) => {
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "si" || normalized === "sí" || normalized === "true" || normalized === "1" ? "si" : "no";
  }
  return Number(value || 0) > 0 ? "si" : "no";
};

const rowKey = (ancho, sistema, piso) => `${ancho}__${sistema}__${piso}`;

const hasValue = (row = {}) => {
  const tapaM = normalizarTapa(row.tapa) === "si" ? n(row.metraje) : 0;
  return NUMERIC_FIELDS.some((campo) => n(row[campo]) !== 0) || tapaM !== 0;
};

export const useBandejas = (obraId, pisos = ["PB"]) => {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(false);
  const saveStatus = useSaveStatus();

  useEffect(() => {
    if (!obraId) return;
    async function cargar() {
      setLoading(true);
      try {
        setDatos(await getBandejas(obraId));
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, [obraId]);

  const fila = (ancho, sistema, piso) => datos.find((d) => d.ancho_mm === ancho && d.sistema === sistema && d.piso === piso) || {};

  const valor = (ancho, sistema, piso, campo) => {
    const row = fila(ancho, sistema, piso);
    return campo === "tapa" ? normalizarTapa(row[campo]) : n(row[campo]);
  };

  const resumen = (ancho, sistema) => {
    const acc = CAMPOS_BANDEJA.reduce((obj, campo) => ({ ...obj, [campo]: 0 }), {});
    pisos.forEach((piso) => {
      const row = fila(ancho, sistema, piso);
      acc.metraje += n(row.metraje);
      acc.tapa += normalizarTapa(row.tapa) === "si" ? n(row.metraje) : 0;
      ACCESSORY_FIELDS.forEach((campo) => {
        acc[campo] += n(row[campo]);
      });
    });
    return acc;
  };

  const resumenSistema = (sistema, anchos) => {
    const acc = CAMPOS_BANDEJA.reduce((obj, campo) => ({ ...obj, [campo]: 0 }), {});
    anchos.forEach((ancho) => {
      const partial = resumen(ancho, sistema);
      CAMPOS_BANDEJA.forEach((campo) => {
        acc[campo] += n(partial[campo]);
      });
    });
    return acc;
  };

  const resumenGeneral = useMemo(() => {
    const acc = CAMPOS_BANDEJA.reduce((obj, campo) => ({ ...obj, [campo]: 0 }), {});
    datos.forEach((row) => {
      acc.metraje += n(row.metraje);
      acc.tapa += normalizarTapa(row.tapa) === "si" ? n(row.metraje) : 0;
      ACCESSORY_FIELDS.forEach((campo) => {
        acc[campo] += n(row[campo]);
      });
    });
    acc.accesorios = ACCESSORY_FIELDS.reduce((sum, campo) => sum + n(acc[campo]), 0);
    acc.registros = datos.filter(hasValue).length;
    return acc;
  }, [datos]);

  const actualizar = async (ancho_mm, sistema, piso, campo, value) => {
    const actual = fila(ancho_mm, sistema, piso);
    const payload = {
      ...actual,
      obra_id: obraId,
      ancho_mm,
      sistema,
      piso,
      [campo]: campo === "tapa" ? normalizarTapa(value) : value,
    };

    const saved = await saveStatus.runSave(() => upsertBandeja(payload));
    setDatos((prev) => [
      saved,
      ...prev.filter((d) => rowKey(d.ancho_mm, d.sistema, d.piso) !== rowKey(ancho_mm, sistema, piso)),
    ]);
  };

  const filasConValores = useMemo(() => datos.filter(hasValue), [datos]);

  const anclajes = useMemo(() => ({}), []);
  const actualizarAnclaje = () => null;

  return {
    pisos,
    datos,
    filasConValores,
    anclajes,
    resumen,
    resumenSistema,
    resumenGeneral,
    valor,
    actualizar,
    actualizarAnclaje,
    loading,
    saveStatus,
  };
};
