import { useMemo, useState } from "react";

const CATEGORIAS_DEFAULT = [
  { id: "I", nombre: "Sereno I" }, { id: "II", nombre: "Sereno II" }, { id: "III", nombre: "Peón Común" },
  { id: "IV", nombre: "Peón Práctico" }, { id: "V", nombre: "Medio Of. Hierro" },
  { id: "VI", nombre: "Medio Of. Madera/Electricista" }, { id: "VII", nombre: "Of. Impermeabilización" },
  { id: "VIII", nombre: "Of. Albañil o Hierro" }, { id: "IX", nombre: "Of. Madera Frent." },
  { id: "X", nombre: "Escalerista / Of. Electricista C" }, { id: "XI", nombre: "Of. Maquinista / Of. Electricista B" },
  { id: "XII", nombre: "Mecánico / Of. Electricista B" }, { id: "XIII", nombre: "XIII" },
  { id: "XIV", nombre: "Of. Electricista A" }, { id: "XV", nombre: "XV" }, { id: "XVI", nombre: "XVI" },
];

export const useJornales = () => {
  const [config, setConfig] = useState({ tipo_liquidacion: 1, dias_mes: 24, horas_dia: 8 });
  const categorias = useMemo(() => CATEGORIAS_DEFAULT, []);
  const actualizarConfig = (cambios) => setConfig((prev) => ({ ...prev, ...cambios }));

  return {
    categorias,
    config,
    actualizarConfig,
    costoHora: () => null,
    totalJornal: () => null,
    nota: "Pendiente: no se implementa costo_hora porque la especificación no trae valores numéricos completos ni fórmula final validada del D1.",
  };
};
