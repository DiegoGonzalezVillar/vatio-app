import { useEffect, useMemo, useState } from "react";
import { getCircuitosByObra } from "../services/api";
import { calcularTotalesCircuitos } from "../utils/calculosCircuitos";

export const useCircuitosTotales = (obraId, tipo) => {
  const [circuitos, setCircuitos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!obraId || !tipo) return;
    async function cargar() {
      setLoading(true);
      try {
        setCircuitos(await getCircuitosByObra(obraId, tipo));
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, [obraId, tipo]);

  const totales = useMemo(() => calcularTotalesCircuitos(circuitos), [circuitos]);
  return { circuitos, totales, loading };
};
