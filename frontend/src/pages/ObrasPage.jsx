import { useEffect, useState } from "react";
import { getObras, deleteObra } from "../services/api";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";

function ObrasPage({ onBack, onVerObra }) {
  const [obras, setObras] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarObras() {
      try {
        const data = await getObras();
        setObras(data);
      } catch (error) {
        console.error(error);
        alert("No se pudieron cargar las obras.");
      } finally {
        setCargando(false);
      }
    }

    cargarObras();
  }, []);

  const obrasFiltradas = obras.filter((obra) =>
    obra.nombre?.toLowerCase().includes(busqueda.toLowerCase()),
  );

  const handleEliminarObra = async (obraId) => {
    const confirmar = window.confirm("¿Seguro que querés eliminar esta obra?");

    if (!confirmar) return;

    try {
      await deleteObra(obraId);
      setObras((prev) => prev.filter((obra) => obra.id !== obraId));
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar la obra.");
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Gestión"
        title="Obras"
        description="Administra las obras cargadas y accede al detalle técnico de cada una."
        action={
          <div style={{ display: "flex", gap: "12px" }}>
            <Button
              variant="primary"
              onClick={() =>
                window.dispatchEvent(new CustomEvent("go-create-obra"))
              }
            >
              + Nueva obra
            </Button>

            <Button variant="secondary" onClick={onBack}>
              ← Volver
            </Button>
          </div>
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

        {cargando ? (
          <EmptyState
            title="Cargando obras..."
            description="Estamos obteniendo la información de la base de datos."
          />
        ) : obrasFiltradas.length === 0 ? (
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
                      <span>Tipo:</span>
                      <strong>{obra.tipo_obra || "-"}</strong>
                    </p>

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

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "16px",
                    }}
                  >
                    <button
                      className={`open-mini-btn ${color}`}
                      onClick={() => onVerObra(obra)}
                    >
                      → Ver / modificar
                    </button>

                    <Button
                      variant="danger"
                      onClick={() => handleEliminarObra(obra.id)}
                    >
                      Eliminar
                    </Button>
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

export default ObrasPage;
