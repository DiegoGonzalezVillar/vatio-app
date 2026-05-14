import { useEffect, useState } from "react";
import { getObras } from "../services/api";
import Button from "../components/ui/Button";
import StatCard from "../components/ui/StatCard";
import EmptyState from "../components/ui/EmptyState";

function HomePage({ onGoObras, onVerObra }) {
  const [obrasRecientes, setObrasRecientes] = useState([]);

  useEffect(() => {
    async function cargarObras() {
      const data = await getObras();
      setObrasRecientes(data.slice(0, 4));
    }

    cargarObras();
  }, []);

  return (
    <div className="home-dashboard">
      <section className="home-top-grid">
        <div className="home-hero">
          <div>
            <p className="eyebrow">Bienvenido a Vatio</p>
            <h1>Gestiona metrados eléctricos con precisión.</h1>
            <p>
              Obras, tableros, circuitos, insumos y reportes técnicos en una
              plataforma moderna.
            </p>

            <Button onClick={onGoObras}>▦ Abrir obras</Button>
          </div>

          <div className="hero-illustration">
            <div className="paper-card">⚡</div>
          </div>
        </div>

        <StatCard
          label="Obras recientes"
          value={obrasRecientes.length}
          description="Últimas obras cargadas"
        />

        <StatCard
          label="Módulos técnicos"
          value="5"
          description="Tableros, circuitos, bandejas y más"
        />

        <StatCard
          label="Cálculos"
          value="Auto"
          description="Valores derivados del tablero"
        />
      </section>

      <section className="home-module-row">
        <button className="module-card" onClick={onGoObras}>
          <div className="module-icon module-blue">▦</div>
          <div>
            <h3>Obras</h3>
            <p>Crear, modificar y administrar obras.</p>
          </div>
          <span className="module-arrow">→</span>
        </button>

        <button className="module-card">
          <div className="module-icon module-orange">⚡</div>
          <div>
            <h3>Insumos</h3>
            <p>Todo tipo de materiales a utilizar.</p>
          </div>
          <span className="module-arrow">→</span>
        </button>

        <button className="module-card">
          <div className="module-icon module-green">▤</div>
          <div>
            <h3>Reportes</h3>
            <p>Consolidar materiales y metrados por obra.</p>
          </div>
          <span className="module-arrow">→</span>
        </button>
      </section>

      <section className="recent-section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Actividad reciente</p>
            <h2>Obras recientes</h2>
          </div>

          <Button variant="secondary" onClick={onGoObras}>
            Ver todas
          </Button>
        </div>

        {obrasRecientes.length === 0 ? (
          <EmptyState
            title="No hay obras cargadas"
            description="Cuando cargues una obra, aparecerá en esta sección."
          />
        ) : (
          <div className="recent-grid">
            {obrasRecientes.map((obra, index) => {
              const colors = ["blue", "green", "orange", "purple"];
              const color = colors[index % colors.length];

              return (
                <article className="recent-card" key={obra.id}>
                  <div className="recent-card-body">
                    <p className={`obra-label ${color}`}>Obra #{obra.id}</p>
                    <h3>{obra.nombre}</h3>

                    <div className="recent-meta-list">
                      <p>
                        <span>Contacto:</span>
                        <strong>{obra.nombre_contacto || "-"}</strong>
                      </p>
                      <p>
                        <span>Ubicación:</span>
                        <strong>{obra.ubicacion || "-"}</strong>
                      </p>
                      <p>
                        <span>Teléfono:</span>
                        <strong>{obra.telefono_contacto || "-"}</strong>
                      </p>
                    </div>

                    <button
                      className={`open-mini-btn ${color}`}
                      onClick={() => onVerObra(obra)}
                    >
                      → Abrir
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;
