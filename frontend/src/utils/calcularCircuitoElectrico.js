const toNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const redondear = (value, decimales = 2) => {
  return Number(value.toFixed(decimales));
};

export const calcularCircuitoElectrico = (circuito = {}, datosTablero = {}) => {
  const xBandeja = toNumber(circuito.metros_bandeja);
  const metrosLosa = toNumber(circuito.metros_losa);
  const metrosPared = toNumber(circuito.metros_saltos_pared);

  const cajaPiso = toNumber(circuito.caja_piso);
  const cajaHonda = toNumber(circuito.caja_honda);
  const cajaLlana = toNumber(circuito.caja_llana);
  const centro = toNumber(circuito.centro);
  const brazo = toNumber(circuito.brazo);

  const bajadaTomas = toNumber(circuito.bajada_tomas);
  const bajadaLuces = toNumber(circuito.bajada_luces);

  const codosEspeciales = toNumber(circuito.codos_especiales);

  const bajadaToma = toNumber(datosTablero.bajada_toma);
  const bajadaLlaveLuz = toNumber(datosTablero.bajada_llave_luz);
  const bajadaTablero = toNumber(datosTablero.bajada_tablero);

  const agregadoToma = toNumber(datosTablero.agregado_toma);
  const agregadoLlaveLuz = toNumber(datosTablero.agregado_llave_luz);
  const agregadoTablero = toNumber(datosTablero.agregado_tablero);

  const agregadoCajaHonda = toNumber(datosTablero.agregado_caja_honda);
  const agregadoCajaCentro = toNumber(datosTablero.agregado_caja_centro);
  const agregadoCajaBrazo = toNumber(datosTablero.agregado_caja_brazo);

  const extraVigas = toNumber(
    datosTablero.extra_altura_vigas ?? datosTablero.extra_por_vigas,
  );

  const totalBajadaTomas = bajadaTomas * bajadaToma;
  const totalBajadaLuces = bajadaLuces * bajadaLlaveLuz;

  const totalCanoLosa =
    metrosLosa +
    extraVigas +
    bajadaTomas * extraVigas +
    bajadaLuces * extraVigas;

  const totalCanoPared =
    bajadaTomas * Math.max(bajadaToma - extraVigas, 0) +
    bajadaLuces * Math.max(bajadaLlaveLuz - extraVigas, 0) +
    metrosPared +
    bajadaTablero;

  const totalCable =
    xBandeja +
    metrosLosa +
    metrosPared +
    cajaPiso * agregadoToma +
    cajaHonda * agregadoCajaHonda +
    bajadaTomas * bajadaToma +
    cajaLlana * agregadoLlaveLuz +
    centro * agregadoCajaCentro +
    brazo * agregadoCajaBrazo +
    bajadaLuces * bajadaLlaveLuz +
    agregadoTablero +
    bajadaTablero;

  const totalCanalizacion = totalCanoLosa + totalCanoPared + xBandeja;

  return {
    total_bajada_tomas: redondear(totalBajadaTomas),
    total_bajada_luces: redondear(totalBajadaLuces),

    total_cano_losa: redondear(totalCanoLosa),
    total_cano_pared: redondear(totalCanoPared),
    total_canalizacion: redondear(totalCanalizacion),

    total_cable: redondear(totalCable),
    codos_especiales: codosEspeciales,
  };
};
