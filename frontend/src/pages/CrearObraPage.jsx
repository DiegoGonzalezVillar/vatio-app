import { useState } from "react";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import CollapsibleSection from "../components/ui/CollapsibleSection";
import { createObra, updateObra } from "../services/api";

function CrearObraPage({
  onBack,
  onVerObra,
  modo = "crear",
  obraInicial = null,
}) {
  const esEdicion = modo === "editar";

  const normalizarFecha = (fecha) => {
    if (!fecha) return "";
    return String(fecha).slice(0, 10);
  };

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const [nombre, setNombre] = useState(obraInicial?.nombre || "");
  const [metros, setMetros] = useState(obraInicial?.metros2 || "");
  const [potencia, setPotencia] = useState(obraInicial?.potencia || "");
  const [tipoObra, setTipoObra] = useState(obraInicial?.tipo_obra || "");
  const [nombreContacto, setNombreContacto] = useState(
    obraInicial?.nombre_contacto || "",
  );
  const [telefono, setTelefono] = useState(
    obraInicial?.telefono_contacto || "",
  );
  const [notasGenerales, setNotasGenerales] = useState(
    obraInicial?.notas_generales || "",
  );
  const [empresaSolicitante, setEmpresaSolicitante] = useState(
    obraInicial?.empresa_solicitante || "",
  );
  const [mailContacto, setMailContacto] = useState(
    obraInicial?.email_contacto || "",
  );
  const [ubicacion, setUbicacion] = useState(obraInicial?.ubicacion || "");
  const [fechaSolicitud, setFechaSolicitud] = useState(
    normalizarFecha(obraInicial?.fecha_solicitud),
  );
  const [archivosRecibidos, setArchivosRecibidos] = useState(
    obraInicial?.archivos_recibidos || "",
  );
  const [fechaEntrega, setFechaEntrega] = useState(
    normalizarFecha(obraInicial?.fecha_entrega),
  );
  const [fechaPresupuesto, setFechaPresupuesto] = useState(
    normalizarFecha(obraInicial?.fecha_presupuesto),
  );
  const [fechaEntregado, setFechaEntregado] = useState(
    normalizarFecha(obraInicial?.fecha_entregado),
  );
  const [observacionProrroga, setObservacionProrroga] = useState(
    obraInicial?.observacion_prorroga || "",
  );
  const [estadoObra, setEstadoObra] = useState(obraInicial?.estado_obra || "");

  const handleGuardarObra = async (e) => {
    e.preventDefault();
    setError("");

    if (!nombre.trim()) {
      setError("El nombre de la obra es obligatorio.");
      return;
    }

    const payload = {
      nombre,
      metros2: metros || null,
      potencia: potencia || null,
      tipo_obra: tipoObra || null,
      nombre_contacto: nombreContacto || null,
      telefono_contacto: telefono || null,
      email_contacto: mailContacto || null,
      ubicacion: ubicacion || null,
      empresa_solicitante: empresaSolicitante || null,
      notas_generales: notasGenerales || null,
      fecha_solicitud: fechaSolicitud || null,
      archivos_recibidos: archivosRecibidos || null,
      fecha_entrega: fechaEntrega || null,
      fecha_presupuesto: fechaPresupuesto || null,
      fecha_entregado: fechaEntregado || null,
      observacion_prorroga: observacionProrroga || null,
      estado_obra: estadoObra || null,
    };

    try {
      setGuardando(true);

      let obraGuardada;

      if (esEdicion) {
        obraGuardada = await updateObra(obraInicial.id, payload);
      } else {
        obraGuardada = await createObra(payload);
      }

      if (onVerObra) {
        onVerObra(obraGuardada);
      }
    } catch (err) {
      console.error(err);
      setError(
        esEdicion
          ? "No se pudo modificar la obra."
          : "No se pudo guardar la obra.",
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="crear-obra-page">
      <PageHeader
        eyebrow="Gestión"
        title={esEdicion ? "Modificar obra" : "Crear obra"}
        description={
          esEdicion
            ? "Actualiza los datos generales, solicitante y trazabilidad de la obra."
            : "Carga los datos generales, solicitante y trazabilidad inicial de la nueva obra."
        }
        action={
          <Button variant="secondary" onClick={onBack}>
            ← Volver a obras
          </Button>
        }
      />

      <form className="crear-obra-layout" onSubmit={handleGuardarObra}>
        <div className="crear-obra-main">
          {error && <div className="form-error">{error}</div>}

          <CollapsibleSection eyebrow="Datos principales" title="Obra">
            <div className="crear-obra-grid">
              <div className="form-field">
                <label>Nombre</label>
                <input
                  placeholder="Nombre de la obra"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Metros2</label>
                <input
                  placeholder="Mts2"
                  value={metros}
                  onChange={(e) => setMetros(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Potencia</label>
                <input
                  placeholder="Potencia"
                  value={potencia}
                  onChange={(e) => setPotencia(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Tipo de obra</label>
                <select
                  value={tipoObra}
                  onChange={(e) => setTipoObra(e.target.value)}
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="Casa">Casa</option>
                  <option value="Edificio">Edificio</option>
                  <option value="Industria">Industria</option>
                  <option value="Oficina">Oficina</option>
                  <option value="Salud">Salud</option>
                  <option value="Otra">Otra</option>
                </select>
              </div>

              <div className="form-field">
                <label>Nombre de contacto</label>
                <input
                  placeholder="Nombre contacto"
                  value={nombreContacto}
                  onChange={(e) => setNombreContacto(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Teléfono</label>
                <input
                  placeholder="Teléfono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </div>

              <div className="form-field span-2">
                <label>Notas generales</label>
                <textarea
                  placeholder="Notas generales"
                  value={notasGenerales}
                  onChange={(e) => setNotasGenerales(e.target.value)}
                />
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection eyebrow="Contacto" title="Solicitante">
            <div className="crear-obra-grid three">
              <div className="form-field">
                <label>Empresa solicitante</label>
                <input
                  placeholder="Empresa solicitante"
                  value={empresaSolicitante}
                  onChange={(e) => setEmpresaSolicitante(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Mail de contacto</label>
                <input
                  placeholder="Mail de contacto"
                  value={mailContacto}
                  onChange={(e) => setMailContacto(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Ubicación</label>
                <input
                  placeholder="Ubicación"
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Fecha solicitud</label>
                <input
                  type="date"
                  value={fechaSolicitud}
                  onChange={(e) => setFechaSolicitud(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Archivos recibidos</label>
                <input
                  placeholder="Nombre o link del archivo"
                  value={archivosRecibidos}
                  onChange={(e) => setArchivosRecibidos(e.target.value)}
                />
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            eyebrow="Seguimiento"
            title="Trazabilidad de la cotización"
          >
            <div className="crear-obra-grid three">
              <div className="form-field">
                <label>Fecha entrega</label>
                <input
                  type="date"
                  value={fechaEntrega}
                  onChange={(e) => setFechaEntrega(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Fecha presupuesto</label>
                <input
                  type="date"
                  value={fechaPresupuesto}
                  onChange={(e) => setFechaPresupuesto(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Fecha entregado</label>
                <input
                  type="date"
                  value={fechaEntregado}
                  onChange={(e) => setFechaEntregado(e.target.value)}
                />
              </div>

              <div className="form-field span-2">
                <label>Observación prórroga</label>
                <textarea
                  placeholder="Observaciones"
                  value={observacionProrroga}
                  onChange={(e) => setObservacionProrroga(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Estado de obra</label>
                <select
                  value={estadoObra}
                  onChange={(e) => setEstadoObra(e.target.value)}
                >
                  <option value="">Seleccionar estado</option>
                  <option value="Cotizando">Cotizando</option>
                  <option value="En espera">En espera</option>
                  <option value="En ejecucion">En ejecución</option>
                  <option value="Perdida">Perdida</option>
                  <option value="Finalizada">Finalizada</option>
                </select>
              </div>
            </div>
          </CollapsibleSection>

          <div className="crear-obra-actions">
            <Button variant="primary" type="submit" disabled={guardando}>
              {guardando
                ? esEdicion
                  ? "Modificando..."
                  : "Guardando..."
                : esEdicion
                  ? "💾 Guardar cambios"
                  : "💾 Guardar obra"}
            </Button>
          </div>
        </div>

        <aside className="crear-obra-sidebar page-card">
          <p className="eyebrow">Resumen</p>
          <h3>{esEdicion ? "Obra en edición" : "Nueva obra"}</h3>

          <div className="crear-obra-sidebar-list">
            <div className="summary-item">
              <small>Tipo de obra</small>
              <strong>{tipoObra || "-"}</strong>
            </div>

            <div className="summary-item">
              <small>Metros</small>
              <strong>{metros ? `${metros} m²` : "-"}</strong>
            </div>

            <div className="summary-item">
              <small>Fecha solicitud</small>
              <strong>{fechaSolicitud || "-"}</strong>
            </div>

            <div className="summary-item">
              <small>Fecha entrega</small>
              <strong>{fechaEntrega || "-"}</strong>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}

export default CrearObraPage;
