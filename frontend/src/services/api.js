const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const json = async (res) => {
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

const get = (url) => fetch(`${API_URL}${url}`).then(json);
const send = (url, method, body) => fetch(`${API_URL}${url}`, {
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
}).then(json);

export const getObras = () => get("/obras");
export const createObra = (obra) => send("/obras", "POST", obra);
export const updateObra = (id, obra) => send(`/obras/${id}`, "PUT", obra);
export const deleteObra = (id) => send(`/obras/${id}`, "DELETE");

export const getTableros = (obraId) => get(`/tableros/obra/${obraId}`);
export const createTablero = (tablero) => send("/tableros", "POST", tablero);
export const getLastTablero = (obraId) => get(`/tableros/last/${obraId}`);

export const getCircuitos = (tableroId, tipo) => get(`/circuitos/tablero/${tableroId}/${tipo}`);
export const getCircuitosByObra = (obraId, tipo) => get(`/circuitos/obra/${obraId}/${tipo}`);
export const createCircuito = (circuito) => send("/circuitos", "POST", circuito);
export const updateCircuito = (id, cambios) => send(`/circuitos/${id}`, "PUT", cambios);
export const deleteCircuito = (id) => send(`/circuitos/${id}`, "DELETE");

export const getTerminaciones = (obraId, tipo) => get(`/terminaciones/obra/${obraId}/${tipo}`);
export const upsertTerminacion = (data) => send("/terminaciones", "POST", data);

export const getPuestaATierra = (obraId) => get(`/puesta-a-tierra/obra/${obraId}`);
export const upsertPuestaATierra = (data) => send("/puesta-a-tierra", "POST", data);
export const deletePuestaATierra = (itemId) => send(`/puesta-a-tierra/${itemId}`, "DELETE", {});

export const getTablerosMateriales = (obraId) => get(`/tableros-materiales/obra/${obraId}`);
export const upsertTableroMaterial = (data) => send("/tableros-materiales", "POST", data);

export const getLuminarias = (obraId) => get(`/luminarias/obra/${obraId}`);
export const upsertLuminaria = (data) => send("/luminarias", "POST", data);

export const getBandejas = (obraId) => get(`/bandejas/obra/${obraId}`);
export const upsertBandeja = (data) => send("/bandejas", "POST", data);

export const getDuctos = (obraId) => get(`/ductos/obra/${obraId}`);
export const upsertDucto = (data) => send("/ductos", "POST", data);

export const getPorteros = (obraId) => get(`/porteros/obra/${obraId}`);
export const createPortero = (data) => send("/porteros", "POST", data);
export const updatePortero = (id, data) => send(`/porteros/${id}`, "PUT", data);
export const deletePortero = (id) => send(`/porteros/${id}`, "DELETE");

export const getTerminacionesCatalogo = (tipo) => get(`/catalogos/terminaciones/${tipo}`);
export const createTerminacionCatalogo = (tipo, data) => send(`/catalogos/terminaciones/${tipo}`, "POST", data);
export const updateTerminacionCatalogo = (tipo, id, data) => send(`/catalogos/terminaciones/${tipo}/${id}`, "PUT", data);
export const deleteTerminacionCatalogo = (tipo, id) => send(`/catalogos/terminaciones/${tipo}/${id}`, "DELETE", {});
