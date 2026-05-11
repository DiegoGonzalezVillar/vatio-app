import { useEffect, useState } from "react";
import { getObras } from "../services/api";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";

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
    <div>
      <PageHeader
        eyebrow="Gestión"
        title="Obras"
        description="Administra las obras cargadas y accede al detalle técnico de cada una."
        action={
          <Button variant="secondary" onClick={onBack}>
            ← Volver
          </Button>
        }
      />

      <section className="page-card obras-panel">
        <div className="obras-toolbar">
          <div className="obras-search">
            <span>⌕</span>
            <input
              placeholder="Buscar obra..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="obras-counter">
            <span>{obrasFiltradas.length}</span>
            obras encontradas
          </div>
        </div>

        {obrasFiltradas.length === 0 ? (
          <EmptyState
            title="No se encontraron obras"
            description="Prueba con otro nombre o carga una nueva obra."
          />
        ) : (
          <div className="obras-grid">
            {obrasFiltradas.map((obra, index) => {
              const colors = ["blue", "green", "orange", "purple"];
              const color = colors[index % colors.length];

              return (
                <article className="obra-card" key={obra.id}>
                  <div>
                    <p className={`obra-label ${color}`}>Obra #{obra.id}</p>
                    <h3>{obra.nombre}</h3>
                  </div>

                  <div className="obra-card-meta">
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
                    → Ver / modificar
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default ObrasPage;
