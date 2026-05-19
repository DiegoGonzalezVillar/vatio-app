import { useEffect, useState } from "react";
import { getPuestaATierra, upsertPuestaATierra } from "../services/api";
import { PUESTA_TIERRA_ITEMS } from "../utils/vatioConstants";
import { useSaveStatus } from "./useSaveStatus";

export const usePuestaATierra = (obraId) => {
  const [cantidades, setCantidades] = useState({});
  const [loading, setLoading] = useState(false);
  const saveStatus = useSaveStatus();

  useEffect(() => {
    if (!obraId) return;
    async function cargar() {
      setLoading(true);
      try {
        const rows = await getPuestaATierra(obraId);
        setCantidades(Object.fromEntries(rows.map((r) => [r.item_id, r.cantidad])));
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, [obraId]);

  const actualizar = async (itemId, cantidad) => {
    const saved = await saveStatus.runSave(() => upsertPuestaATierra({ obra_id: obraId, item_id: itemId, cantidad }));
    setCantidades((prev) => ({ ...prev, [itemId]: saved.cantidad }));
  };

  return { items: PUESTA_TIERRA_ITEMS, cantidades, actualizar, loading, saveStatus };
};
