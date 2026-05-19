import { useMemo, useState } from "react";
import { updateObra } from "../services/api";
import { useCircuitosTotales } from "./useCircuitosTotales";
import { COEF_ERROR_CANALIZACIONES_DEFAULT, consolidarCanalizaciones } from "../utils/calculosCanalizaciones";
import { useSaveStatus } from "./useSaveStatus";

export const useCanalizaciones = (obra) => {
  const obraId = obra?.id;
  const electrica = useCircuitosTotales(obraId, "electrica");
  const debiles = useCircuitosTotales(obraId, "debiles");
  const [coeficiente, setCoeficiente] = useState(Number(obra?.coeficiente_error_canalizaciones || COEF_ERROR_CANALIZACIONES_DEFAULT));
  const saveStatus = useSaveStatus();

  const consolidado = useMemo(
    () => consolidarCanalizaciones(electrica.totales, debiles.totales, coeficiente),
    [electrica.totales, debiles.totales, coeficiente],
  );

  const guardarCoeficiente = async (valor) => {
    setCoeficiente(Number(valor || COEF_ERROR_CANALIZACIONES_DEFAULT));
    if (!obraId) return;
    await saveStatus.runSave(() => updateObra(obraId, { ...obra, coeficiente_error_canalizaciones: Number(valor || COEF_ERROR_CANALIZACIONES_DEFAULT) }));
  };

  return {
    consolidado,
    coeficiente,
    setCoeficiente: guardarCoeficiente,
    loading: electrica.loading || debiles.loading,
    saveStatus,
  };
};
