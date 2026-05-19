import { DIAMETROS } from "./vatioConstants";
import { crearTotalesCircuitosVacios } from "./calculosCircuitos";

export const COEF_ERROR_CANALIZACIONES_DEFAULT = 1.08;
const n = (value) => Number(value || 0);

const sumarMapa = (a = {}, b = {}) => DIAMETROS.reduce((acc, d) => {
  acc[d] = n(a[d]) + n(b[d]);
  return acc;
}, {});

const aplicarCoef = (mapa = {}, coeficiente = COEF_ERROR_CANALIZACIONES_DEFAULT) => DIAMETROS.reduce((acc, d) => {
  acc[d] = n(mapa[d]) * n(coeficiente || COEF_ERROR_CANALIZACIONES_DEFAULT);
  return acc;
}, {});

export const consolidarCanalizaciones = (electricaRaw = {}, debilesRaw = {}, coeficiente = COEF_ERROR_CANALIZACIONES_DEFAULT) => {
  const electricaBase = { ...crearTotalesCircuitosVacios(), ...electricaRaw };
  const debiles = { ...crearTotalesCircuitosVacios(), ...debilesRaw };
  const electrica = electricaBase;

  const sumatoria = {
    corrugado: {
      losa: sumarMapa(electrica.corrugado_losa, debiles.corrugado_losa),
      pared: sumarMapa(electrica.corrugado_pared, debiles.corrugado_pared),
    },
    galvanizado: {
      losa: sumarMapa(electrica.galvanizado_losa, debiles.galvanizado_losa),
      pared: sumarMapa(electrica.galvanizado_pared, debiles.galvanizado_pared),
    },
    pvc: {
      losa: sumarMapa(electrica.pvc_losa, debiles.pvc_losa),
      pared: sumarMapa(electrica.pvc_pared, debiles.pvc_pared),
    },
  };

  const picadasYeso = n(electrica.picada_yeso_m) + n(debiles.picada_yeso_m);
  const picadasMamposteria = n(electrica.picada_mamposteria_m) + n(debiles.picada_mamposteria_m);
  const picadasPiso = n(electrica.picada_piso_m) + n(debiles.picada_piso_m);
  const zanjas = n(electrica.zanja_m) + n(debiles.zanja_m);

  return {
    coeficiente: n(coeficiente || COEF_ERROR_CANALIZACIONES_DEFAULT),
    electrica,
    debiles,
    sumatoria,
    total_con_coeficiente: {
      corrugado: { losa: aplicarCoef(sumatoria.corrugado.losa, coeficiente), pared: aplicarCoef(sumatoria.corrugado.pared, coeficiente) },
      galvanizado: { losa: aplicarCoef(sumatoria.galvanizado.losa, coeficiente), pared: aplicarCoef(sumatoria.galvanizado.pared, coeficiente) },
      pvc: { losa: aplicarCoef(sumatoria.pvc.losa, coeficiente), pared: aplicarCoef(sumatoria.pvc.pared, coeficiente) },
    },
    picadas: {
      yeso: picadasYeso,
      mamposteria: picadasMamposteria,
      piso: picadasPiso,
      zanja: zanjas,
    },
  };
};
