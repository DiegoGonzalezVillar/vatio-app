import { parseDecimalValue } from "./format";
import { DIAMETROS } from "./vatioConstants";

const n = (value) => parseDecimalValue(value, 0);
const round3 = (value) => Number(n(value).toFixed(3));
const picada = (value) => (value === true ? 1 : n(value));
const baseDiametros = () => DIAMETROS.reduce((acc, d) => ({ ...acc, [d]: 0 }), {});

export const crearTotalesCircuitosVacios = () => ({
  cp: 0, ch: 0, cll: 0, cc: 0, cb: 0,
  bajadas_tomas: 0, bajadas_tomas_picadas: 0,
  bajadas_luces: 0, bajadas_luces_picadas: 0,
  cable_metros: 0, codos_especiales: 0, bandeja_metros: 0,
  caño_piso: 0,
  picada_yeso_m: 0,
  picada_mamposteria_m: 0,
  picada_piso_m: 0,
  zanja_m: 0,
  corrugado_losa: baseDiametros(), corrugado_pared: baseDiametros(),
  galvanizado_losa: baseDiametros(), galvanizado_pared: baseDiametros(),
  pvc_losa: baseDiametros(), pvc_pared: baseDiametros(),
  conductores: {},
});

const grupoCaneria = (tipo) => {
  if (tipo === "CORRUGADO") return "corrugado";
  if (tipo === "GALVA") return "galvanizado";
  if (tipo === "PVC") return "pvc";
  return null;
};

export const alturasTablero = (tablero = {}) => {
  const alturaLocal = n(tablero.altura_local ?? tablero.AlturaLocal);
  const alturaLlave = n(tablero.altura_llave_luz ?? tablero.AlturaLlaveLuz);
  const alturaToma = n(tablero.altura_toma ?? tablero.AlturaToma);
  const alturaTablero = n(tablero.altura_tablero ?? tablero.AlturaTablero);
  const alturaBrazo = n(tablero.altura_brazo ?? tablero.alturaBrazo);
  const alturaEspecial = n(tablero.altura_especial ?? tablero.alturaEspecial);

  return {
    alturaLocal,
    bajadaLlaveLuzM: Math.max(alturaLocal - alturaLlave, 0),
    bajadaTomaM: Math.max(alturaLocal - alturaToma, 0),
    bajadaTableroM: Math.max(alturaLocal - alturaTablero, 0),
    bajadaBrazoM: Math.max(alturaLocal - alturaBrazo, 0),
    bajadaEspecialM: Math.max(alturaLocal - alturaEspecial, 0),
  };
};

export const calcularDetalleTecnicoLegacy = (detalle = {}, tablero = {}) => {
  const { bajadaLlaveLuzM, bajadaTomaM, bajadaBrazoM, bajadaEspecialM } = alturasTablero(tablero);
  const canalizaciones = Array.isArray(detalle?.canalizaciones) ? detalle.canalizaciones : [];

  const out = {
    caño_losa: 0,
    caño_pared: 0,
    caño_piso: 0,
    cable_horizontal_m: 0,
    picada_yeso_m: 0,
    picada_mamposteria_m: 0,
    picada_piso_m: 0,
    zanja_m: 0,
    codos_especiales: 0,
    bajadas_luces: 0,
    bajadas_tomas: 0,
    bajadas_brazo: 0,
    bajadas_especiales: 0,
    cable_bajadas_m: 0,
    caño_pared_bajadas_m: 0,
  };

  canalizaciones.forEach((canalizacion) => {
    const cano = canalizacion?.cano || canalizacion || {};
    const metros = n(cano.metros ?? cano.metrosComposicion);
    const instalacion = String(cano.instalacion ?? "");
    const subinstalacion = String(cano.subinstalacion ?? cano.subinstalar ?? "");
    const yesoMuro = String(cano.yesomuro ?? cano.yeso_muro ?? "").toLowerCase();
    const picadaZanja = Boolean(cano.picadazanja ?? cano.picado ?? cano.zanja);

    if (["1", "2", "3", "6"].includes(instalacion)) {
      out.caño_losa += metros;
      if (subinstalacion === "3") out.picada_yeso_m += metros;
    } else if (instalacion === "4") {
      out.caño_pared += metros;
      if (subinstalacion === "6") {
        if (yesoMuro === "yeso" || n(cano.yeso) > 0) out.picada_yeso_m += metros;
        if (yesoMuro === "muro" || yesoMuro === "mamposteria" || yesoMuro === "mampostería" || n(cano.muro) > 0) out.picada_mamposteria_m += metros;
      }
    } else if (instalacion === "5") {
      out.caño_piso += metros;
      if (subinstalacion === "1" && picadaZanja) out.picada_piso_m += metros;
      if (subinstalacion === "2" && picadaZanja) out.zanja_m += metros;
    }

    out.cable_horizontal_m += metros;

    const bajadas = Array.isArray(canalizacion?.canoBajada) ? canalizacion.canoBajada : [];
    bajadas.forEach((bajada) => {
      const tipoBajada = n(bajada.tipoBajada ?? bajada.tipo_bajada);
      const cantidad = n(bajada.cantidad);
      const picadas = n(bajada.picadas);
      const material = n(bajada.material);
      const cantCodos = n(bajada.cantCodos ?? bajada.codos);
      const altura = tipoBajada === 1 ? bajadaLlaveLuzM
        : tipoBajada === 2 ? bajadaTomaM
        : tipoBajada === 3 ? bajadaBrazoM
        : tipoBajada === 4 ? bajadaEspecialM
        : 0;

      if (tipoBajada === 1) out.bajadas_luces += cantidad;
      if (tipoBajada === 2) out.bajadas_tomas += cantidad;
      if (tipoBajada === 3) out.bajadas_brazo += cantidad;
      if (tipoBajada === 4) out.bajadas_especiales += cantidad;

      out.caño_pared_bajadas_m += altura * cantidad;
      out.cable_bajadas_m += altura * cantidad;
      out.codos_especiales += cantCodos;

      if (material === 1) out.picada_mamposteria_m += altura * picadas;
      if (material === 2) out.picada_yeso_m += altura * picadas;
    });
  });

  return Object.fromEntries(Object.entries(out).map(([k, v]) => [k, round3(v)]));
};

const calcularPicadasSimplificadas = (entrada = {}, tablero = {}) => {
  const { bajadaLlaveLuzM, bajadaTomaM } = alturasTablero(tablero);
  // Equivalencia práctica tomada de la lógica vieja cuando no hay detalle técnico:
  // bajada_luces_picadas representa picadas de llaves/luces y se calcula con altura de llave;
  // bajada_tomas_picadas representa picadas de tomas y se calcula con altura de toma.
  return {
    picada_yeso_m: round3(picada(entrada.bajada_luces_picadas) * bajadaLlaveLuzM),
    picada_mamposteria_m: round3(picada(entrada.bajada_tomas_picadas) * bajadaTomaM),
  };
};

export const calcularDatosDerivadosCircuito = (entrada = {}, tablero = {}) => {
  const detalle = typeof entrada.detalle_tecnico === "string"
    ? (() => { try { return JSON.parse(entrada.detalle_tecnico); } catch { return null; } })()
    : entrada.detalle_tecnico;

  if (detalle?.canalizaciones?.length) {
    const legacy = calcularDetalleTecnicoLegacy(detalle, tablero);
    return {
      caño_losa: legacy.caño_losa,
      caño_pared: legacy.caño_pared + legacy.caño_pared_bajadas_m,
      caño_piso: legacy.caño_piso,
      cable_metros: legacy.cable_horizontal_m + legacy.cable_bajadas_m,
      codos_especiales: legacy.codos_especiales,
      bajada_tomas: legacy.bajadas_tomas,
      bajada_luces: legacy.bajadas_luces,
      picada_yeso_m: legacy.picada_yeso_m,
      picada_mamposteria_m: legacy.picada_mamposteria_m,
      picada_piso_m: legacy.picada_piso_m,
      zanja_m: legacy.zanja_m,
    };
  }

  const { bajadaLlaveLuzM, bajadaTomaM, bajadaTableroM } = alturasTablero(tablero);
  const agregadoLlave = n(tablero.agregado_caja_centro ?? tablero.agregadoCajaCentro);
  const agregadoToma = n(tablero.agregado_caja_honda ?? tablero.agregadoCajaHonda);
  const agregadoTablero = n(tablero.agregado_tablero ?? tablero.AgregadoTablero);
  const extraVigas = n(tablero.extra_por_vigas);

  const xBandeja = n(entrada.bandeja_metros || entrada.bandeja);
  const xCanoLosa = n(entrada.x_cano_losa ?? entrada.caño_losa);
  const enSaltosPared = n(entrada.en_saltos);
  const cajaPiso = n(entrada.caja_piso);
  const cajaHonda = n(entrada.caja_honda);
  const bajadaTomas = n(entrada.bajada_tomas);
  const cajaLlana = n(entrada.caja_llana);
  const cajaCentro = n(entrada.caja_centro);
  const cajaBrazo = n(entrada.caja_brazo);
  const bajadaLuces = n(entrada.bajada_luces);

  const canoLosa = xCanoLosa + extraVigas + bajadaTomas * extraVigas + bajadaLuces * extraVigas;
  const canoPared = bajadaTomas * Math.max(bajadaTomaM - extraVigas, 0)
    + bajadaLuces * Math.max(bajadaLlaveLuzM - extraVigas, 0)
    + enSaltosPared;

  const cableMetros = entrada.numero
    ? xBandeja
      + xCanoLosa
      + enSaltosPared
      + (cajaPiso + cajaHonda) * agregadoToma
      + bajadaTomas * bajadaTomaM
      + (cajaLlana + cajaCentro + cajaBrazo) * agregadoLlave
      + bajadaLuces * bajadaLlaveLuzM
      + agregadoTablero
      + bajadaTableroM
    : 0;

  const picadas = calcularPicadasSimplificadas(entrada, tablero);

  return {
    caño_losa: round3(canoLosa),
    caño_pared: round3(canoPared),
    caño_piso: round3(entrada.caño_piso),
    cable_metros: round3(cableMetros),
    codos_especiales: n(entrada.codos_especiales),
    bajada_tomas: n(entrada.bajada_tomas),
    bajada_luces: n(entrada.bajada_luces),
    picada_yeso_m: picadas.picada_yeso_m,
    picada_mamposteria_m: picadas.picada_mamposteria_m,
    picada_piso_m: round3(entrada.picada_piso_m),
    zanja_m: round3(entrada.zanja_m),
  };
};

export const prepararCircuitoParaGuardar = (entrada = {}, tablero = {}) => {
  const derivados = calcularDatosDerivadosCircuito(entrada, tablero);
  return {
    ...entrada,
    caño_losa: derivados.caño_losa,
    caño_pared: derivados.caño_pared,
    caño_piso: derivados.caño_piso,
    cable_metros: derivados.cable_metros,
    codos_especiales: derivados.codos_especiales,
    bajada_tomas: derivados.bajada_tomas,
    bajada_luces: derivados.bajada_luces,
    picada_yeso_m: derivados.picada_yeso_m,
    picada_mamposteria_m: derivados.picada_mamposteria_m,
    picada_piso_m: derivados.picada_piso_m,
    zanja_m: derivados.zanja_m,
  };
};

export const calcularTotalesCircuitos = (circuitos = []) => {
  const totales = crearTotalesCircuitosVacios();

  circuitos.forEach((c) => {
    totales.cp += n(c.caja_piso);
    totales.ch += n(c.caja_honda);
    totales.cll += n(c.caja_llana);
    totales.cc += n(c.caja_centro);
    totales.cb += n(c.caja_brazo);
    totales.bajadas_tomas += n(c.bajada_tomas);
    totales.bajadas_tomas_picadas += picada(c.bajada_tomas_picadas);
    totales.bajadas_luces += n(c.bajada_luces);
    totales.bajadas_luces_picadas += picada(c.bajada_luces_picadas);
    totales.cable_metros += n(c.cable_metros);
    totales.codos_especiales += n(c.codos_especiales);
    totales.bandeja_metros += n(c.bandeja_metros || c.bandeja);
    totales.caño_piso += n(c.caño_piso);
    totales.picada_yeso_m += n(c.picada_yeso_m);
    totales.picada_mamposteria_m += n(c.picada_mamposteria_m);
    totales.picada_piso_m += n(c.picada_piso_m);
    totales.zanja_m += n(c.zanja_m);

    const grupo = grupoCaneria(c.tipo_conductor);
    const diametro = c.diametro;
    if (grupo && diametro) {
      totales[`${grupo}_losa`][diametro] = n(totales[`${grupo}_losa`][diametro]) + n(c.caño_losa);
      totales[`${grupo}_pared`][diametro] = n(totales[`${grupo}_pared`][diametro]) + n(c.caño_pared);
    }

    if (c.conductor) {
      totales.conductores[c.conductor] = n(totales.conductores[c.conductor]) + 1;
    }
  });

  return totales;
};
