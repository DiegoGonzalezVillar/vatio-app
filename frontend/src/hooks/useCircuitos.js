import { useEffect, useMemo, useState } from "react";
import { calcularTotalesCircuitos } from "../utils/calculosCircuitos";
import { createCircuito, deleteCircuito, getCircuitos, updateCircuito } from "../services/api";
import { useSaveStatus } from "./useSaveStatus";

export const useCircuitos = (tableroId, tipo) => {
  const [circuitos, setCircuitos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const saveStatus = useSaveStatus();

  const cargar = async () => {
    if (!tableroId || !tipo) return;
    setLoading(true);
    setError("");
    try {
      setCircuitos(await getCircuitos(tableroId, tipo));
    } catch (err) {
      setError("No se pudieron cargar los circuitos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, [tableroId, tipo]);

  const totales = useMemo(() => calcularTotalesCircuitos(circuitos), [circuitos]);

  const agregarCircuito = async (circuito) => {
    const nuevo = await saveStatus.runSave(() => createCircuito({ ...circuito, tablero_id: tableroId, tipo }));
    setCircuitos((prev) => [nuevo, ...prev]);
    return nuevo;
  };

  const editarCircuito = async (id, cambios) => {
    const actualizado = await saveStatus.runSave(() => updateCircuito(id, cambios));
    setCircuitos((prev) => prev.map((c) => (c.id === id ? actualizado : c)));
    return actualizado;
  };

  const eliminarCircuito = async (id) => {
    await saveStatus.runSave(() => deleteCircuito(id));
    setCircuitos((prev) => prev.filter((c) => c.id !== id));
  };

  const duplicarCircuito = async (id) => {
    const origen = circuitos.find((c) => c.id === id);
    if (!origen) return null;
    const { id: _id, created_at, updated_at, numero, ...resto } = origen;
    return agregarCircuito({ ...resto, numero: `${numero || "Circuito"} copia` });
  };

  return { circuitos, totales, loading, error, saveStatus, cargar, agregarCircuito, editarCircuito, eliminarCircuito, duplicarCircuito };
};
