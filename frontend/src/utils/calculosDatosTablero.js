const toNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const redondear = (value, decimales = 2) => {
  return Number(value.toFixed(decimales));
};

export const calcularDatosTablero = (tablero = {}) => {
  const alturaLocal = toNumber(tablero.altura_local);
  const alturaLlaveLuz = toNumber(tablero.altura_llave_luz);
  const alturaToma = toNumber(tablero.altura_toma);
  const alturaTablero = toNumber(tablero.altura_tablero);
  const alturaBrazo = toNumber(tablero.altura_brazo);
  const alturaEspecial = toNumber(tablero.altura_especial);

  const agregadoTablero = toNumber(tablero.agregado_tablero);
  const agregadoCajaHonda = toNumber(tablero.agregado_caja_honda);
  const agregadoCajaCentro = toNumber(tablero.agregado_caja_centro);
  const agregadoCajaBrazo = toNumber(tablero.agregado_caja_brazo);
  const agregadoHEspecial = toNumber(tablero.agregado_h_especial);

  const bajadaLlaveLuz = alturaLocal - alturaLlaveLuz;
  const bajadaToma = alturaLocal - alturaToma;
  const bajadaTablero = alturaLocal - alturaTablero;
  const bajadaBrazo = alturaLocal - alturaBrazo;
  const bajadaEspecial = alturaLocal - alturaEspecial;

  return {
    bajada_llave_luz: redondear(bajadaLlaveLuz),
    bajada_toma: redondear(bajadaToma),
    bajada_tablero: redondear(bajadaTablero),
    bajada_brazo: redondear(bajadaBrazo),
    bajada_especial: redondear(bajadaEspecial),

    total_tablero: redondear(bajadaTablero + agregadoTablero),
    total_caja_honda: redondear(bajadaToma + agregadoCajaHonda),
    total_caja_centro: redondear(bajadaLlaveLuz + agregadoCajaCentro),
    total_caja_brazo: redondear(bajadaBrazo + agregadoCajaBrazo),
    total_h_especial: redondear(bajadaEspecial + agregadoHEspecial),
  };
};
