const API_URL = "http://localhost:3000/api";

export const getObras = async () => {
  const res = await fetch(`${API_URL}/obras`);
  return res.json();
};

export const createObra = async (obra) => {
  const res = await fetch("http://localhost:3000/api/obras", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obra),
  });

  return res.json();
};

export const getTableros = async (obraId) => {
  const res = await fetch(`http://localhost:3000/api/tableros/obra/${obraId}`);
  return res.json();
};

export const createTablero = async (tablero) => {
  const res = await fetch("http://localhost:3000/api/tableros", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tablero),
  });

  return res.json();
};

export const getLastTablero = async (obraId) => {
  const res = await fetch(`http://localhost:3000/api/tableros/last/${obraId}`);

  return res.json();
};
