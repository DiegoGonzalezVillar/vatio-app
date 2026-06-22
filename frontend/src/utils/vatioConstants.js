export const TIPOS_CIRCUITO = {
  electrica: "electrica",
  debiles: "debiles",
};

export const TIPOS_CONDUCTOR_CANALIZACION = ["CORRUGADO", "GALVA", "PVC", "X BANDEJA"];
export const DIAMETROS = ["Ø16", "Ø20", "Ø25", "Ø32", "Ø40", "Ø50", "Ø63", "Ø110"];
export const DIAMETROS_POR_TIPO = {
  CORRUGADO: ["Ø16", "Ø20", "Ø25", "Ø32", "Ø40"],
  GALVA: ["Ø20", "Ø25", "Ø32", "Ø40", "Ø50"],
  PVC: DIAMETROS,
  "X BANDEJA": DIAMETROS,
};

export const CONDUCTORES_ELECTRICA = [
  "CF1 II", "CF1 III", "CF1 IV", "CF2 II", "CF2 III", "CF2 IV",
  "CF2.5 II", "CF2.5 III", "CF2.5 IV", "CF4 II", "CF4 III", "CF4 IV",
  "CF6 II", "CF6 III", "CF6 IV", "CF10 II", "SP3X1", "SP3X1.5",
  "SP3X2", "SP3X4", "SP4X1.5", "SP5X2", "SP5X6", "SP5X10",
];

export const CONDUCTORES_DEBILES = [
  "2 Pares", "4 Pares", "Portero", "Cat 5", "Cat 6", "CCTV", "TV", "Incendio", "Intrusión",
];

export const CONDUCTORES_POR_TIPO = {
  electrica: CONDUCTORES_ELECTRICA,
  debiles: CONDUCTORES_DEBILES,
};

export const TERMINACIONES_ELECTRICA = [
  { titulo: "CÁMARAS" },
  { item: "Cámara 20 x 20", tipo_caja: "CAMARA", materiales: ["GENERAL"] },
  { item: "Cámara 40 x 40", tipo_caja: "CAMARA", materiales: ["GENERAL"] },
  { item: "Cámara 60 x 60", tipo_caja: "CAMARA", materiales: ["GENERAL"] },
  { item: "Cámara 60 x 110", tipo_caja: "CAMARA", materiales: ["GENERAL"] },

  { titulo: "CAJA LLANA" },
  { item: "INTERRUPTOR PULSADOR", tipo_caja: "LLANA" },
  { item: "INTERRUPTOR UNIPOLAR", tipo_caja: "LLANA" },
  { item: "INTERRUPTOR UNIPOLAR 2S", tipo_caja: "LLANA" },
  { item: "MOTOR PARA BOMBA CON BOTONERA PARA DUCTO", tipo_caja: "LLANA" },
  { item: "INTERRUPTOR UNIPOLAR 3S", tipo_caja: "LLANA" },
  { item: "COMBINACIÓN + UNIPOLAR", tipo_caja: "LLANA" },
  { item: "INTERRUPTOR U. DE COMBINACION", tipo_caja: "LLANA" },
  { item: "SENSOR DE MOVIMIENTO PARA LUZ", tipo_caja: "LLANA" },
  { item: "INTERRUPTOR U. DE COMBINACION 2S", tipo_caja: "LLANA" },
  { item: "TIMBRE", tipo_caja: "LLANA" },

  { titulo: "CAJA HONDA" },
  { item: "TOMACORRIENTE SCHUCKO", tipo_caja: "HONDA" },
  { item: "TOMACORRIENTE TRES EN LINEA", tipo_caja: "HONDA" },
  { item: "TOMACORRIENTE UNIVERSAL", tipo_caja: "HONDA" },
  { item: "TOMACORRIENTE INDUSTRIAL PARA DUCTO", tipo_caja: "HONDA" },
  { item: "TC PARA DUCTO", tipo_caja: "HONDA" },
  { item: "TOMACORRIENTE SCHUKO C/BIPOLAR", tipo_caja: "HONDA" },
  { item: "TOMACORRIENTE 3 EN LINEA C/BIPOLAR", tipo_caja: "HONDA" },
  { item: "TC EMBUTIDO CIELORRASO", tipo_caja: "HONDA" },
  { item: "INTERRUPTOR BIPOLAR", tipo_caja: "HONDA" },
  { item: "CONECCIÓN A. ACONDICIONADO", tipo_caja: "HONDA" },
  { item: "TOMACORRIENTE SCHUKO + TRES EN LINEA", tipo_caja: "HONDA" },

  { titulo: "CAJA CENTRO" },
  { item: "CAJA CENTRO LUMINARIA", tipo_caja: "CENTRO" },
  { item: "CAJA PARA TUBO DE LUZ", tipo_caja: "CENTRO" },
  { item: "CAJA PARA ARTEFACTO", tipo_caja: "CENTRO" },
  { item: "ART DE EMB DOBLE", tipo_caja: "CENTRO" },
  { item: "CENTRO DICROICA", tipo_caja: "CENTRO" },
  { item: "EMBUTIDO BAJO CONSUMO", tipo_caja: "CENTRO" },
  { item: "LUZ DE EMERGENCIA", tipo_caja: "CENTRO" },
  { item: "LUZ DE SALIDA EMERGENCIA (mirar según criterio)", tipo_caja: "CENTRO" },
  { item: "SENSOR 180 º", tipo_caja: "CENTRO" },
  { item: "LED DE PISO PARA LUMINARIA 10", tipo_caja: "CENTRO" },
  { item: "LED DE PISO PARA LUMINARIA 6", tipo_caja: "CENTRO" },
  { item: "CONEXIÓN FIJA", tipo_caja: "CENTRO" },

  { titulo: "CAJA BRAZO" },
  { item: "VENTILADOR - EXTRACTOR", tipo_caja: "BRAZO" },
  { item: "CAJA TUBO LUMINARIA", tipo_caja: "BRAZO" },
  { item: "CAJA BRAZO LUMINARIA", tipo_caja: "BRAZO" },
  { item: "INDICADOR ESC. DE EMERGENCIA", tipo_caja: "BRAZO" },
  { item: "FLECHA LED DE EMERGENCIA", tipo_caja: "BRAZO" },
  { item: "LUZ DE EMERGENCIA (mirar según criterio)", tipo_caja: "BRAZO" },
  { item: "LUZ DE SALIDA EMERGENCIA (mirar según criterio)", tipo_caja: "BRAZO" },
  { item: "LUZ SALIDA DE GARAGE", tipo_caja: "BRAZO" },

  { titulo: "REGISTROS" },
  { item: "R 10 x 10", tipo_caja: "REGISTRO" },
  { item: "R 15 x 20", tipo_caja: "REGISTRO" },
  { item: "R 25 x 35", tipo_caja: "REGISTRO" },
  { item: "R 40 x 50", tipo_caja: "REGISTRO" },
  { item: "REGISTROS PARA CADA PISO", tipo_caja: "REGISTRO" },

  { titulo: "OTROS" },
  { item: "TABLERO PORTERO ELECTRICO", tipo_caja: "OTROS" },
  { item: "TERMOSTATO", tipo_caja: "OTROS" },
];

export const TIPOS_CAJA_TERMINACIONES = ["LLANA", "HONDA", "CENTRO", "BRAZO", "CAMARA", "REGISTRO", "OTROS"];

export const TERMINACIONES_DEBILES = [
  { titulo: "INCENDIO" },
  { item: "PORTERO", tipo_caja: "HONDA" },
  { item: "CERROJO ELÉCTRICO", tipo_caja: "HONDA" },
  { item: "CONEXIÓN RJ45 TEL", tipo_caja: "HONDA" },
  { item: "TV (CUENTA SOLO CAJA)", tipo_caja: "HONDA" },
  { item: "MONITOR DE CCTV", tipo_caja: "HONDA" },
  { item: "CONEXIÓN RJ45 DATOS", tipo_caja: "HONDA" },
  { item: "TVC", tipo_caja: "HONDA" },
  { item: "PULSADOR EMERG. DE INCENDIO (SOLO CAJA)", tipo_caja: "HONDA" },
  { item: "CENTRAL ALARMA DE INCENDIO (SOLO CAJA)", tipo_caja: "HONDA" },
  { item: "SENSOR DE CALOR DIRECCIONABLE (SOLO CAJA)", tipo_caja: "HONDA" },
  { titulo: "ALARMA" },
  { item: "SENSOR DE HUMO DIRECCIONABLE (SOLO CAJA)", tipo_caja: "CENTRO" },
  { item: "SENSOR DE GAS", tipo_caja: "CENTRO" },
];

export const MATERIALES_TABLEROS = [
  "INT TQ 1P 10A 6KA", "INT TQ 1P 16A 6KA", "INT TQ 1P 20A 6KA", "INT TQ 1P 25A 6KA", "INT TQ 1P 32A 6KA",
  "INT TQ 2P 6A 6KA", "INT TQ 2P 10A 6KA", "INT TQ 2P 16A 6KA", "INT TQ 2P 20A 6KA", "INT TQ 2P 25A 6KA", "INT TQ 2P 32A 6KA", "INT TQ 2P 40A 6KA", "INT TQ 2P 50A 6KA",
  "INT TQ 3P 10A 6KA", "INT TQ 3P 16A 6KA", "INT TQ 3P 20A 6KA", "INT TQ 3P 25A 6KA", "INT TQ 3P 32A 6KA", "INT TQ 3P 40A 6KA", "INT TQ 3P 50A 6KA", "INT TQ 3P 63A 6KA", "INT TQ 3P 80A 6KA",
  "INT TQ 4P 10A 6KA", "INT TQ 4P 16A 6KA", "INT TQ 4P 20A 6KA",
];

export const PUESTA_TIERRA_ITEMS = [
  { id: "conductor_50", label: "Conductor desnudo 50mm²", unidad: "m" },
  { id: "soldadura", label: "Soldadura exotérmica", unidad: "unid" },
  { id: "camara_40", label: "Cámara 40x40", unidad: "unid" },
  { id: "jabalina_copperweld", label: "Jabalina tipo Copperweld 5/8'' x 2m", unidad: "unid" },
  { id: "jabalina_14mm", label: "Jabalina 14mm 2m20", unidad: "unid" },
];

export const TIPOS_LUMINARIA = [
  "LUMINARIA 1", "LUMINARIA 2", "LUMINARIA 3", "LUMINARIA 4", "LUMINARIA 5", "LUMINARIA 6", "LUMINARIA 7", "LUMINARIA 8", "LUMINARIA 9", "LUMINARIA 10", "LUMINARIA 11", "LUMINAR. S.I.", "LUM. EXTERIOR", "LUMINARIA 13", "CIALÍTICA",
];

export const ANCHOS_BANDEJA = ["100mm", "200mm", "300mm", "400mm"];
export const SISTEMAS = ["electrica", "datos"];
export const CAMPOS_BANDEJA = [
  "metraje", "tapa", "curva_horizontal", "curva_articulada", "vertical_ext", "vertical_int", "cruces_h", "cruces_v", "descenso", "derivacion", "desvio_h", "desvio_h_izq", "desvio_h_der", "desvio_v",
];
export const TAMAÑOS_DUCTO = ["20x10mm", "25x30mm", "60x40mm", "100x50mm"];
