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

export async function updateObra(id, data) {
  const response = await fetch(`${API_URL}/obras/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("No se pudo modificar la obra");
  }

  return response.json();
}

export async function deleteObra(id) {
  const response = await fetch(`${API_URL}/obras/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("No se pudo eliminar la obra");
  }

  return response.json();
}

export async function deleteTablero(id) {
  const response = await fetch(`${API_URL}/tableros/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Error al eliminar tablero");
  }

  return true;
}

export async function updateTablero(id, data) {
  const response = await fetch(`${API_URL}/tableros/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error al modificar tablero");
  }

  return response.json();
}

export async function getCircuitosElectricosByTablero(tableroId) {
  const res = await fetch(
    `${API_URL}/circuitos-electricos/tablero/${tableroId}`,
  );

  if (!res.ok) {
    throw new Error("No se pudieron cargar los circuitos eléctricos");
  }

  return res.json();
}

export async function createCircuitoElectrico(data) {
  const res = await fetch(`${API_URL}/circuitos-electricos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("No se pudo crear el circuito eléctrico");
  }

  return res.json();
}

export async function updateCircuitoElectrico(id, data) {
  const res = await fetch(`${API_URL}/circuitos-electricos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("No se pudo modificar el circuito eléctrico");
  }

  return res.json();
}

export async function deleteCircuitoElectrico(id) {
  const res = await fetch(`${API_URL}/circuitos-electricos/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("No se pudo eliminar el circuito eléctrico");
  }

  return res.json();
}
