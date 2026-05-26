import { useEffect, useMemo, useState } from "react";
import { getDuctos, upsertDucto } from "../services/api";
import { parseDecimalValue } from "../utils/format";
import { useSaveStatus } from "./useSaveStatus";

const n = (value) => parseDecimalValue(value, 0);
const rowKey = (tamaño, sistema, piso) => `${tamaño}__${sistema}__${piso}`;

const hasValue = (row = {}) => n(row.metros) !== 0 || n(row.quiebres) !== 0;

export const useDuctos = (obraId, pisos = ["PB"]) => {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(false);
  const saveStatus = useSaveStatus();

  useEffect(() => {
    if (!obraId) return;
    async function cargar() {
      setLoading(true);
      try {
        setDatos(await getDuctos(obraId));
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, [obraId]);

  const fila = (tamaño, sistema, piso) =>
    datos.find((d) => d.tamaño === tamaño && d.sistema === sistema && d.piso === piso) || {};

  const valor = (tamaño, sistema, piso, campo) => n(fila(tamaño, sistema, piso)[campo]);

  const resumen = (tamaño, sistema) => {
    const acc = { metros: 0, quiebres: 0 };
    pisos.forEach((piso) => {
      acc.metros += valor(tamaño, sistema, piso, "metros");
      acc.quiebres += valor(tamaño, sistema, piso, "quiebres");
    });
    return acc;
  };

  const resumenSistema = (sistema, tamaños) =>
    tamaños.reduce(
      (acc, tamaño) => {
        const partial = resumen(tamaño, sistema);
        acc.metros += partial.metros;
        acc.quiebres += partial.quiebres;
        return acc;
      },
      { metros: 0, quiebres: 0 }
    );

  const resumenGeneral = useMemo(() => {
    const acc = datos.reduce(
      (totals, row) => {
        totals.metros += n(row.metros);
        totals.quiebres += n(row.quiebres);
        return totals;
      },
      { metros: 0, quiebres: 0 }
    );
    acc.registros = datos.filter(hasValue).length;
    return acc;
  }, [datos]);

  const filasConValores = useMemo(() => datos.filter(hasValue), [datos]);

  const actualizar = async (tamaño, sistema, piso, campo, value) => {
    const actual = fila(tamaño, sistema, piso);
    const payload = {
      ...actual,
      obra_id: obraId,
      tamaño,
      sistema,
      piso,
      [campo]: value,
    };

    const saved = await saveStatus.runSave(() => upsertDucto(payload));
    setDatos((prev) => [
      saved,
      ...prev.filter((d) => rowKey(d.tamaño, d.sistema, d.piso) !== rowKey(tamaño, sistema, piso)),
    ]);
  };

  return {
    pisos,
    datos,
    filasConValores,
    resumen,
    resumenSistema,
    resumenGeneral,
    valor,
    actualizar,
    loading,
    saveStatus,
  };
};
