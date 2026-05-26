const n = (value) => Number(value || 0);

export const calcularPicadasTerminaciones = (totalesCircuitos = {}) => ({
  metros_interruptores: n(totalesCircuitos.bajadas_luces) * 2,
  metros_tomas: n(totalesCircuitos.bajadas_tomas) * 2.9,
  total_metros: n(totalesCircuitos.bajadas_luces) * 2 + n(totalesCircuitos.bajadas_tomas) * 2.9,
  reales_metrado: n(totalesCircuitos.bajadas_luces_picadas) + n(totalesCircuitos.bajadas_tomas_picadas),
});
