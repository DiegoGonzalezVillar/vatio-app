import { useEffect, useState } from "react";
import { getObras } from "../services/api";

function ObrasPage({ onBack, onVerObra }) {
  const [obras, setObras] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    async function cargarObras() {
      const data = await getObras();
      setObras(data);
    }

    cargarObras();
  }, []);

  const obrasFiltradas = obras.filter((obra) =>
    obra.nombre.toLowerCase().includes(busqueda.toLowerCase()),
  );

  return (
    <div className="page-card">
      <div className="section-header">
        <div>
          <p className="eyebrow">Gestión</p>
          <h2>Obras</h2>
        </div>

        <button className="btn-secondary" onClick={onBack}>
          ← Volver
        </button>
      </div>

      <input
        placeholder="Buscar obra..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <div className="tableros-list">
        {obrasFiltradas.map((obra) => (
          <div className="tablero-card" key={obra.id}>
            <h3>{obra.nombre}</h3>
            <p>
              <strong>Contacto:</strong> {obra.nombre_contacto || "-"}
            </p>
            <p>
              <strong>Ubicación:</strong> {obra.ubicacion || "-"}
            </p>

            <button className="btn-primary" onClick={() => onVerObra(obra)}>
              Ver / modificar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ObrasPage;
