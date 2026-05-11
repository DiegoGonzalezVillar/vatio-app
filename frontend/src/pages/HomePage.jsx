import { useEffect, useState } from "react";
import { getObras } from "../services/api";

function HomePage({ onGoObras, onVerObra }) {
  const [obrasRecientes, setObrasRecientes] = useState([]);

  useEffect(() => {
    async function cargarObras() {
      const data = await getObras();
      setObrasRecientes(data.slice(0, 3));
    }

    cargarObras();
  }, []);

  return (
    <div className="home-page">
      <section className="hero">
        <div>
          <p className="eyebrow">Panel de control</p>
          <h1>Sistema de metrado y conteo eléctrico</h1>
          <p className="hero-text">
            Gestiona obras, tableros, circuitos, insumos y reportes desde un
            solo lugar.
          </p>
        </div>

        <button className="btn-primary" onClick={onGoObras}>
          Ir a obras
        </button>
      </section>

      <section className="module-grid">
        <button className="module-card" onClick={onGoObras}>
          <div className="module-icon">🏗️</div>
          <h3>Obras</h3>
          <p>Crear, buscar y administrar obras.</p>
        </button>

        <button className="module-card">
          <div className="module-icon">📦</div>
          <h3>Insumos</h3>
          <p>Gestionar materiales y precios.</p>
        </button>

        <button className="module-card">
          <div className="module-icon">📊</div>
          <h3>Reportes</h3>
          <p>Exportar metrados y presupuestos.</p>
        </button>
      </section>

      <section className="recent-section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Actividad reciente</p>
            <h2>Obras recientes</h2>
          </div>

          <button className="btn-secondary" onClick={onGoObras}>
            Ver todas
          </button>
        </div>

        <div className="recent-grid">
          {obrasRecientes.map((obra) => (
            <article className="recent-card" key={obra.id}>
              <div className="recent-card-header">
                <h3>{obra.nombre}</h3>
                <button onClick={() => onVerObra(obra)}>Ver más</button>
              </div>

              <p>
                <strong>Contacto:</strong> {obra.nombre_contacto || "-"}
              </p>
              <p>
                <strong>Teléfono:</strong> {obra.telefono_contacto || "-"}
              </p>
              <p>
                <strong>Ubicación:</strong> {obra.ubicacion || "-"}
              </p>

              <div className="recent-card-footer">
                Última actualización:{" "}
                {obra.updated_at
                  ? new Date(obra.updated_at).toLocaleDateString()
                  : "-"}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
