const n = (value) => {
  if (value === undefined || value === null || value === "") return 0;
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const raw = String(value).trim();
  if (!raw) return 0;
  const normalized = raw.includes(",") ? raw.replace(/\./g, "").replace(",", ".") : raw;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const CAMPOS_VALIDACION_EXCEL = [
  "cano_losa",
  "cano_pared",
  "cable_metros",
  "metros_bandeja",
  "caja_honda",
  "caja_llana",
  "centro",
  "brazo",
  "bajada_tomas",
  "bajada_luces",
  "picadas",
  "conductores",
  "codos_pvc",
  "codos_galvanizado",
  "uniones_pvc",
  "uniones_galvanizado",
  "uniones_bandeja",
];

export function compararContraExcel(resultadoVatio = {}, resultadoExcel = {}, tolerancia = 0.01) {
  return CAMPOS_VALIDACION_EXCEL.map((campo) => {
    const vatio = n(resultadoVatio[campo]);
    const excel = n(resultadoExcel[campo]);
    const diferencia = Number((vatio - excel).toFixed(2));

    return {
      campo,
      vatio,
      excel,
      diferencia,
      coincide: Math.abs(vatio - excel) <= tolerancia,
    };
  });
}

export function resumenValidacionExcel(resultadoVatio = {}, resultadoExcel = {}, tolerancia = 0.01) {
  const comparacion = compararContraExcel(resultadoVatio, resultadoExcel, tolerancia);
  const diferencias = comparacion.filter((fila) => !fila.coincide);

  return {
    total_campos: comparacion.length,
    campos_ok: comparacion.length - diferencias.length,
    campos_con_diferencia: diferencias.length,
    coincide: diferencias.length === 0,
    comparacion,
  };
}
