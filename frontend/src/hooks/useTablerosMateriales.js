import { useEffect, useMemo, useState } from "react";
import { getTableros, getTablerosMateriales, upsertTableroMaterial } from "../services/api";
import { MATERIALES_TABLEROS } from "../utils/vatioConstants";
import { useSaveStatus } from "./useSaveStatus";

const n = (v) => Number(v || 0);

export const useTablerosMateriales = (obraId) => {
  const [tableros, setTableros] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(false);
  const saveStatus = useSaveStatus();
  const materiales = useMemo(() => MATERIALES_TABLEROS.map((nombre) => ({ id: nombre, nombre })), []);

  useEffect(() => {
    if (!obraId) return;
    async function cargar() {
      setLoading(true);
      try {
        const [tabs, mats] = await Promise.all([getTableros(obraId), getTablerosMateriales(obraId)]);
        setTableros(tabs);
        setRegistros(mats);
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, [obraId]);

  const registro = (material, tableroId) => registros.find((r) => r.material === material && Number(r.tablero_id) === Number(tableroId)) || {};
  const cantidad = (material, tableroId) => n(registro(material, tableroId).cantidad);
  const precio = (material) => n(registros.find((r) => r.material === material)?.precio_usd);
  const totalMaterial = (material) => tableros.reduce((acc, t) => acc + cantidad(material, t.id) * n(t.cantidad_tableros || 1), 0);
  const subtotalMaterial = (material) => totalMaterial(material) * precio(material);

  const totalObra = useMemo(() => ({
    tableros_usd: tableros.reduce((s, t) => s + n(t.precio_tablero_usd || t.precio_tablero) * n(t.cantidad_tableros || 1), 0),
    materiales_usd: materiales.reduce((s, m) => s + subtotalMaterial(m.id), 0),
  }), [tableros, registros, materiales]);
  totalObra.total = totalObra.tableros_usd + totalObra.materiales_usd;

  const guardar = async (material, tableroId, cambios) => {
    const saved = await saveStatus.runSave(() => upsertTableroMaterial({ obra_id: obraId, tablero_id: tableroId, material, ...registro(material, tableroId), ...cambios }));
    setRegistros((prev) => [saved, ...prev.filter((r) => !(r.material === material && Number(r.tablero_id) === Number(tableroId))) ]);
  };

  const actualizarCantidad = (materialId, tableroId, cant) => guardar(materialId, tableroId, { cantidad: cant });
  const actualizarPrecio = (materialId, precioUSD) => Promise.all(tableros.map((t) => guardar(materialId, t.id, { precio_usd: precioUSD })));

  return { tableros, materiales, cantidad, precio, totalMaterial, subtotalMaterial, totalObra, actualizarCantidad, actualizarPrecio, loading, saveStatus };
};
