import { useEffect, useMemo, useState } from "react";
import { createObra, getObras } from "../services/api";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";

const OBRA_INICIAL = {
  nombre: "",
  nombre_contacto: "",
  telefono_contacto: "",
  email_contacto: "",
  ubicacion: "",
};

function ObrasPage({ onBack, onVerObra }) {
  const [obras, setObras] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [form, setForm] = useState(OBRA_INICIAL);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [loading, setLoading] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const cargarObras = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getObras();
      setObras(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las obras. Revisá que el backend esté levantado.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarObras();
  }, []);

  const obrasFiltradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    if (!texto) return obras;

    return obras.filter((obra) =>
      [obra.nombre, obra.nombre_contacto, obra.ubicacion, obra.telefono_contacto]
        .filter(Boolean)
        .some((valor) => String(valor).toLowerCase().includes(texto)),
    );
  }, [obras, busqueda]);

  const actualizarCampo = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const limpiarFormulario = () => {
    setForm(OBRA_INICIAL);
  };

  const handleCrearObra = async (e) => {
    e.preventDefault();

    if (!form.nombre.trim()) {
      setError("El nombre de la obra es obligatorio.");
      return;
    }

    try {
      setGuardando(true);
      setError("");

      const nuevaObra = await createObra({
        nombre: form.nombre.trim(),
        nombre_contacto: form.nombre_contacto.trim() || null,
        telefono_contacto: form.telefono_contacto.trim() || null,
        email_contacto: form.email_contacto.trim() || null,
        ubicacion: form.ubicacion.trim() || null,
      });

      limpiarFormulario();
      setMostrarFormulario(false);
      await cargarObras();

      if (nuevaObra?.id && onVerObra) {
        onVerObra(nuevaObra);
      }
    } catch (err) {
      console.error(err);
      setError("No se pudo crear la obra. Revisá la terminal del backend para ver el detalle.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Gestión"
        title="Obras"
        description="Administra las obras cargadas y accede al detalle técnico de cada una."
        action={
          <div className="button-row" style={{ justifyContent: "flex-end" }}>
            <Button
              variant="primary"
              onClick={() => {
                setError("");
                setMostrarFormulario((actual) => !actual);
              }}
            >
              {mostrarFormulario ? "Ocultar formulario" : "+ Nueva obra"}
            </Button>

            <Button variant="secondary" onClick={onBack}>
              ← Volver
            </Button>
          </div>
        }
      />

      {mostrarFormulario && (
        <section className="page-card" style={{ marginBottom: 18 }}>
          <p className="eyebrow">Nueva obra</p>
          <h3 style={{ marginTop: 0 }}>Cargar datos iniciales</h3>

          <form onSubmit={handleCrearObra}>
            <div className="form-grid">
              <div className="form-field">
                <label>Nombre de la obra *</label>
                <input
                  value={form.nombre}
                  onChange={(e) => actualizarCampo("nombre", e.target.value)}
                  placeholder="Ej: Edificio Central"
                />
              </div>

              <div className="form-field">
                <label>Nombre contacto</label>
                <input
                  value={form.nombre_contacto}
                  onChange={(e) => actualizarCampo("nombre_contacto", e.target.value)}
                  placeholder="Responsable o cliente"
                />
              </div>

              <div className="form-field">
                <label>Teléfono contacto</label>
                <input
                  value={form.telefono_contacto}
                  onChange={(e) => actualizarCampo("telefono_contacto", e.target.value)}
                  placeholder="Ej: 099123456"
                />
              </div>

              <div className="form-field">
                <label>Email contacto</label>
                <input
                  type="email"
                  value={form.email_contacto}
                  onChange={(e) => actualizarCampo("email_contacto", e.target.value)}
                  placeholder="contacto@empresa.com"
                />
              </div>

              <div className="form-field form-field-wide">
                <label>Ubicación</label>
                <input
                  value={form.ubicacion}
                  onChange={(e) => actualizarCampo("ubicacion", e.target.value)}
                  placeholder="Dirección o referencia"
                />
              </div>
            </div>

            <div className="button-row" style={{ marginTop: 16 }}>
              <button className="btn-primary" type="submit" disabled={guardando}>
                {guardando ? "Guardando..." : "Guardar obra"}
              </button>
              <button
                className="btn-secondary"
                type="button"
                disabled={guardando}
                onClick={limpiarFormulario}
              >
                Limpiar
              </button>
            </div>
          </form>
        </section>
      )}

      {error && (
        <section className="page-card" style={{ marginBottom: 18, borderColor: "#fecaca" }}>
          <strong style={{ color: "#b91c1c" }}>{error}</strong>
        </section>
      )}

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

        {loading ? (
          <EmptyState title="Cargando obras" description="Consultando la base de datos..." />
        ) : obrasFiltradas.length === 0 ? (
          <EmptyState
            title="No se encontraron obras"
            description="Usá el botón Nueva obra para cargar la primera."
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
