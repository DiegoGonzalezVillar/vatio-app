import { useEffect, useMemo, useState } from "react";
import { getLuminarias, upsertLuminaria } from "../services/api";
import { TIPOS_LUMINARIA } from "../utils/vatioConstants";
import { useSaveStatus } from "./useSaveStatus";

const pisosDefault = ["PB"];
const n = (v) => Number(v || 0);

export const useLuminarias = (obraId, pisos = pisosDefault) => {
  const [luminarias, setLuminarias] = useState([]);
  const [loading, setLoading] = useState(false);
  const saveStatus = useSaveStatus();

  useEffect(() => {
    if (!obraId) return;
    async function cargar() {
      setLoading(true);
      try {
        setLuminarias(await getLuminarias(obraId));
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, [obraId]);

  const descripcion = (tipo) => luminarias.find((l) => l.tipo === tipo)?.descripcion || "";
  const cantidad = (tipo, piso) => n(luminarias.find((l) => l.tipo === tipo && l.piso === piso)?.cantidad);
  const totalPorTipo = (tipo) => pisos.reduce((acc, piso) => acc + cantidad(tipo, piso), 0);
  const totalGeneral = useMemo(() => TIPOS_LUMINARIA.reduce((acc, tipo) => acc + totalPorTipo(tipo), 0), [luminarias, pisos]);

  const guardar = async ({ tipo, piso, cantidad: cant, descripcion: desc }) => {
    const saved = await saveStatus.runSave(() => upsertLuminaria({ obra_id: obraId, tipo, piso, cantidad: cant, descripcion: desc }));
    setLuminarias((prev) => {
      const rest = prev.filter((l) => !(l.tipo === tipo && l.piso === piso));
      return [saved, ...rest];
    });
    return saved;
  };

  const actualizarCantidad = (tipo, piso, cant) => guardar({ tipo, piso, cantidad: cant, descripcion: descripcion(tipo) });
  const actualizarDescripcion = (tipo, desc) => Promise.all(pisos.map((piso) => guardar({ tipo, piso, cantidad: cantidad(tipo, piso), descripcion: desc })));

  return { pisos, luminarias, descripcion, cantidad, totalPorTipo, totalGeneral, actualizarCantidad, actualizarDescripcion, loading, saveStatus };
};
