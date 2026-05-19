import { useEffect, useMemo, useState } from "react";
import { getTableros, getTerminaciones, upsertTerminacion } from "../services/api";
import { TERMINACIONES_DEBILES, TERMINACIONES_ELECTRICA } from "../utils/vatioConstants";
import { useSaveStatus } from "./useSaveStatus";

const n = (v) => Number(v || 0);
const itemsPorTipo = (tipo) => (tipo === "debiles" ? TERMINACIONES_DEBILES : TERMINACIONES_ELECTRICA);

export const useTerminaciones = (obraId, tipo) => {
  const [tableros, setTableros] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(false);
  const saveStatus = useSaveStatus();
  const items = useMemo(() => itemsPorTipo(tipo), [tipo]);

  const cargar = async () => {
    if (!obraId || !tipo) return;
    setLoading(true);
    try {
      const [tabs, terms] = await Promise.all([getTableros(obraId), getTerminaciones(obraId, tipo)]);
      setTableros(tabs);
      setRegistros(terms);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, [obraId, tipo]);

  const valor = (item, tableroId, material) => n(registros.find((r) => r.item === item && Number(r.tablero_id) === Number(tableroId) && r.material === material)?.cantidad);

  const totalesPorTablero = (tableroId) => ["LLANA", "HONDA", "CENTRO", "BRAZO"].reduce((acc, tipoCaja) => {
    acc[tipoCaja.toLowerCase()] = {
      plastico: registros.filter((r) => r.tipo_caja === tipoCaja && Number(r.tablero_id) === Number(tableroId) && r.material === "PLASTICO").reduce((s, r) => s + n(r.cantidad), 0),
      metal: registros.filter((r) => r.tipo_caja === tipoCaja && Number(r.tablero_id) === Number(tableroId) && r.material === "METAL").reduce((s, r) => s + n(r.cantidad), 0),
    };
    return acc;
  }, {});

  const totalesGlobales = useMemo(() => ["LLANA", "HONDA", "CENTRO", "BRAZO"].reduce((acc, tipoCaja) => {
    acc[tipoCaja.toLowerCase()] = {
      plastico: registros.filter((r) => r.tipo_caja === tipoCaja && r.material === "PLASTICO").reduce((s, r) => s + n(r.cantidad), 0),
      metal: registros.filter((r) => r.tipo_caja === tipoCaja && r.material === "METAL").reduce((s, r) => s + n(r.cantidad), 0),
    };
    return acc;
  }, {}), [registros]);

  const actualizarCantidad = async (item, tipo_caja, tableroId, material, cantidad) => {
    const registro = await saveStatus.runSave(() => upsertTerminacion({ obra_id: obraId, tipo, tablero_id: tableroId, item, tipo_caja, material, cantidad }));
    setRegistros((prev) => {
      const sinActual = prev.filter((r) => !(r.item === item && Number(r.tablero_id) === Number(tableroId) && r.material === material));
      return [registro, ...sinActual];
    });
  };

  return { tableros, items, registros, valor, totalesPorTablero, totalesGlobales, actualizarCantidad, cargar, loading, saveStatus };
};
