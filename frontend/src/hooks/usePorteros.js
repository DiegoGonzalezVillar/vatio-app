import { useEffect, useMemo, useState } from "react";
import { createPortero, deletePortero, getPorteros, updatePortero } from "../services/api";
import { useSaveStatus } from "./useSaveStatus";

export const usePorteros = (obraId) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const saveStatus = useSaveStatus();

  useEffect(() => {
    if (!obraId) return;
    async function cargar() {
      setLoading(true);
      try {
        setItems(await getPorteros(obraId));
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, [obraId]);

  const subtotal = (item) => Number(item.cant || 0) * Number(item.precio || 0);
  const total = useMemo(() => items.reduce((acc, i) => acc + subtotal(i), 0), [items]);

  const agregarItem = async (item) => {
    const saved = await saveStatus.runSave(() => createPortero({ ...item, obra_id: obraId }));
    setItems((prev) => [saved, ...prev]);
  };

  const editarItem = async (id, cambios) => {
    const saved = await saveStatus.runSave(() => updatePortero(id, cambios));
    setItems((prev) => prev.map((i) => (i.id === id ? saved : i)));
  };

  const eliminarItem = async (id) => {
    await saveStatus.runSave(() => deletePortero(id));
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return { items, subtotal, total, agregarItem, editarItem, eliminarItem, loading, saveStatus };
};
