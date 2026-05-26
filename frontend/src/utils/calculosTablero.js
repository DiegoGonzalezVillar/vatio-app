export const calcularDatosTablero = (tablero) => {
  const alturaLocal = Number(tablero.altura_local || 0);
  const alturaLlaveLuz = Number(tablero.altura_llave_luz || 0);
  const alturaToma = Number(tablero.altura_toma || 0);
  const alturaTablero = Number(tablero.altura_tablero || 0);
  const alturaBrazo = Number(tablero.altura_brazo || 0);
  const alturaEspecial = Number(tablero.altura_especial || 0);

  const agregadoTablero = Number(tablero.agregado_tablero || 0);
  const agregadoCajaHonda = Number(tablero.agregado_caja_honda || 0);
  const agregadoCajaCentro = Number(tablero.agregado_caja_centro || 0);
  const agregadoCajaBrazo = Number(tablero.agregado_caja_brazo || 0);
  const agregadoHEspecial = Number(tablero.agregado_h_especial || 0);
  console.log(alturaLocal);
  console.log(alturaLlaveLuz);
  return {
    bajada_llave_luz: alturaLocal - alturaLlaveLuz,
    bajada_toma: alturaLocal - alturaToma,
    bajada_tablero: alturaLocal - alturaTablero,
    bajada_brazo: alturaLocal - alturaBrazo,
    bajada_especial: alturaLocal - alturaEspecial,

    total_tablero: alturaLocal - alturaTablero + agregadoTablero,
    total_caja_honda: alturaLocal - alturaToma + agregadoCajaHonda,
    total_caja_centro: alturaLocal - alturaLlaveLuz + agregadoCajaCentro,
    total_caja_brazo: alturaLocal - alturaBrazo + agregadoCajaBrazo,
    total_h_especial: alturaLocal - alturaEspecial + agregadoHEspecial,
  };
};
