import { useEffect, useState } from "react";
import {
  getTableros,
  createTablero,
  updateTablero,
  getLastTablero,
} from "../services/api";

import toast from "react-hot-toast";

import TableroForm from "../components/TableroForm";
import TablerosList from "../components/TablerosList";
import TableroDetalle from "../components/TableroDetalle";

import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";
import CollapsibleSection from "../components/ui/CollapsibleSection";

function ObraDetallePage({ obra, onBack }) {
  const [tableros, setTableros] = useState([]);
  const [tableroSeleccionado, setTableroSeleccionado] = useState(null);
  const [tableroEditando, setTableroEditando] = useState(null);

  const [nombreTablero, setNombreTablero] = useState("");
  const [alturaLocal, setAlturaLocal] = useState("");
  const [alturaLlaveLuz, setAlturaLlaveLuz] = useState("");
  const [alturaToma, setAlturaToma] = useState("");
  const [alturaTablero, setAlturaTablero] = useState("");
  const [agregadoTablero, setAgregadoTablero] = useState("");
  const [alturaBrazo, setAlturaBrazo] = useState("");
  const [alturaEspecial, setAlturaEspecial] = useState("");
  const [agregadoCajaHonda, setAgregadoCajaHonda] = useState("");
  const [agregadoCajaCentro, setAgregadoCajaCentro] = useState("");
  const [agregadoCajaBrazo, setAgregadoCajaBrazo] = useState("");
  const [agregadoHEspecial, setAgregadoHEspecial] = useState("");
  const [tipoTableroId, setTipoTableroId] = useState(1);

  useEffect(() => {
    if (!obra?.id) return;

    let activo = true;

    async function cargarTablerosIniciales() {
      const data = await getTableros(obra.id);

      if (activo) {
        setTableros(data);
        setTableroSeleccionado(null);
        setTableroEditando(null);
      }
    }

    cargarTablerosIniciales();

    return () => {
      activo = false;
    };
  }, [obra?.id]);

  const cargarTableros = async () => {
    if (!obra?.id) return;

    const data = await getTableros(obra.id);
    setTableros(data);
  };

  const limpiarFormularioTablero = () => {
    setTableroEditando(null);
    setNombreTablero("");
    setAlturaLocal("");
    setAlturaLlaveLuz("");
    setAlturaToma("");
    setAlturaTablero("");
    setAgregadoTablero("");
    setAlturaBrazo("");
    setAlturaEspecial("");
    setAgregadoCajaHonda("");
    setAgregadoCajaCentro("");
    setAgregadoCajaBrazo("");
    setAgregadoHEspecial("");
    setTipoTableroId(1);
  };

  const handleEditarTablero = (tablero) => {
    setTableroEditando(tablero);

    setNombreTablero(tablero.nombre || "");
    setAlturaLocal(tablero.altura_local || "");
    setAlturaLlaveLuz(tablero.altura_llave_luz || "");
    setAlturaToma(tablero.altura_toma || "");
    setAlturaTablero(tablero.altura_tablero || "");
    setAgregadoTablero(tablero.agregado_tablero || "");
    setAlturaBrazo(tablero.altura_brazo || "");
    setAlturaEspecial(tablero.altura_especial || "");
    setAgregadoCajaHonda(tablero.agregado_caja_honda || "");
    setAgregadoCajaCentro(tablero.agregado_caja_centro || "");
    setAgregadoCajaBrazo(tablero.agregado_caja_brazo || "");
    setAgregadoHEspecial(tablero.agregado_h_especial || "");
    setTipoTableroId(tablero.tipo_tablero_id || 1);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCrearTablero = async (e) => {
    e.preventDefault();

    if (!nombreTablero.trim()) return;

    const payload = {
      obra_id: Number(obra.id),
      nombre: nombreTablero,
      tipo_tablero_id: Number(tipoTableroId),
      altura_local: alturaLocal,
      altura_tablero: alturaTablero,
      agregado_tablero: agregadoTablero,
      altura_toma: alturaToma,
      altura_llave_luz: alturaLlaveLuz,
      altura_brazo: alturaBrazo,
      altura_especial: alturaEspecial,
      agregado_caja_honda: agregadoCajaHonda,
      agregado_caja_centro: agregadoCajaCentro,
      agregado_caja_brazo: agregadoCajaBrazo,
      agregado_h_especial: agregadoHEspecial,
    };

    try {
      if (tableroEditando) {
        await updateTablero(tableroEditando.id, payload);
        toast.success("Tablero actualizado correctamente");
      } else {
        await createTablero(payload);
        toast.success("Tablero creado correctamente");
      }

      limpiarFormularioTablero();
      await cargarTableros();
    } catch (error) {
      console.error(error);
      toast.error("No se pudo guardar el tablero");
    }
  };

  const handleNuevoConAnterior = async () => {
    const ultimo = await getLastTablero(obra.id);

    if (!ultimo) {
      alert("No hay un tablero anterior para copiar");
      return;
    }

    setTableroEditando(null);
    setNombreTablero("");
    setAlturaLocal(ultimo.altura_local || "");
    setAlturaLlaveLuz(ultimo.altura_llave_luz || "");
    setAlturaToma(ultimo.altura_toma || "");
    setAlturaTablero(ultimo.altura_tablero || "");
    setAgregadoTablero(ultimo.agregado_tablero || "");
    setAlturaBrazo(ultimo.altura_brazo || "");
    setAlturaEspecial(ultimo.altura_especial || "");
    setAgregadoCajaHonda(ultimo.agregado_caja_honda || "");
    setAgregadoCajaCentro(ultimo.agregado_caja_centro || "");
    setAgregadoCajaBrazo(ultimo.agregado_caja_brazo || "");
    setAgregadoHEspecial(ultimo.agregado_h_especial || "");
    setTipoTableroId(ultimo.tipo_tablero_id || 1);
  };

  if (!obra) {
    return (
      <div>
        <PageHeader
          eyebrow="Obra"
          title="No hay obra seleccionada"
          description="Vuelve al listado y selecciona una obra para continuar."
          action={
            <Button variant="secondary" onClick={onBack}>
              ← Volver
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="obra-detalle-page">
      <PageHeader
        eyebrow="Detalle de obra"
        title={obra.nombre}
        description="Administra la configuración técnica, tableros y cálculos derivados de esta obra."
        action={
          <Button variant="secondary" onClick={onBack}>
            ← Volver a obras
          </Button>
        }
      />

      <CollapsibleSection
        eyebrow="Datos generales"
        title="Información de la obra"
        defaultOpen={true}
      >
        <div className="obra-card-meta">
          <p>
            <span>Nombre:</span>
            <strong>{obra.nombre || "-"}</strong>
          </p>
          <p>
            <span>Tipo:</span>
            <strong>{obra.tipo_obra || "-"}</strong>
          </p>
          <p>
            <span>Metros²:</span>
            <strong>{obra.metros2 || "-"}</strong>
          </p>
          <p>
            <span>Potencia:</span>
            <strong>{obra.potencia || "-"}</strong>
          </p>
          <p>
            <span>Contacto:</span>
            <strong>{obra.nombre_contacto || "-"}</strong>
          </p>
          <p>
            <span>Teléfono:</span>
            <strong>{obra.telefono_contacto || "-"}</strong>
          </p>
          <p>
            <span>Email:</span>
            <strong>{obra.email_contacto || "-"}</strong>
          </p>
          <p>
            <span>Ubicación:</span>
            <strong>{obra.ubicacion || "-"}</strong>
          </p>
          <p>
            <span>Empresa:</span>
            <strong>{obra.empresa_solicitante || "-"}</strong>
          </p>
          <p>
            <span>Estado:</span>
            <strong>{obra.estado_obra || "-"}</strong>
          </p>
          <p>
            <span>Archivos:</span>
            <strong>{obra.archivos_recibidos || "-"}</strong>
          </p>
          <p>
            <span>Fecha solicitud:</span>
            <strong>{obra.fecha_solicitud?.slice(0, 10) || "-"}</strong>
          </p>
          <p>
            <span>Fecha entrega:</span>
            <strong>{obra.fecha_entrega?.slice(0, 10) || "-"}</strong>
          </p>
          <p>
            <span>Fecha presupuesto:</span>
            <strong>{obra.fecha_presupuesto?.slice(0, 10) || "-"}</strong>
          </p>
          <p>
            <span>Fecha entregado:</span>
            <strong>{obra.fecha_entregado?.slice(0, 10) || "-"}</strong>
          </p>
          <p>
            <span>Observación prórroga:</span>
            <strong>{obra.observacion_prorroga || "-"}</strong>
          </p>
          <p>
            <span>Notas:</span>
            <strong>{obra.notas_generales || "-"}</strong>
          </p>
        </div>
      </CollapsibleSection>

      <section className="obra-summary-grid">
        <article className="obra-summary-card blue">
          <span>Contacto</span>
          <strong>{obra.nombre_contacto || "-"}</strong>
          <p>Responsable o solicitante de la obra</p>
        </article>

        <article className="obra-summary-card green">
          <span>Teléfono</span>
          <strong>{obra.telefono_contacto || "-"}</strong>
          <p>Dato de comunicación principal</p>
        </article>

        <article className="obra-summary-card orange">
          <span>Email</span>
          <strong>{obra.email_contacto || "-"}</strong>
          <p>Correo asociado al contacto</p>
        </article>

        <article className="obra-summary-card purple">
          <span>Ubicación</span>
          <strong>{obra.ubicacion || "-"}</strong>
          <p>Dirección o referencia de la obra</p>
        </article>
      </section>

      <CollapsibleSection
        eyebrow="Configuración"
        title={tableroEditando ? "Modificar tablero" : "Crear tablero"}
        defaultOpen={true}
      >
        <TableroForm
          nombreTablero={nombreTablero}
          setNombreTablero={setNombreTablero}
          alturaLocal={alturaLocal}
          setAlturaLocal={setAlturaLocal}
          alturaTablero={alturaTablero}
          setAlturaTablero={setAlturaTablero}
          agregadoTablero={agregadoTablero}
          setAgregadoTablero={setAgregadoTablero}
          alturaToma={alturaToma}
          setAlturaToma={setAlturaToma}
          alturaLlaveLuz={alturaLlaveLuz}
          setAlturaLlaveLuz={setAlturaLlaveLuz}
          alturaBrazo={alturaBrazo}
          setAlturaBrazo={setAlturaBrazo}
          alturaEspecial={alturaEspecial}
          setAlturaEspecial={setAlturaEspecial}
          agregadoCajaHonda={agregadoCajaHonda}
          setAgregadoCajaHonda={setAgregadoCajaHonda}
          agregadoCajaCentro={agregadoCajaCentro}
          setAgregadoCajaCentro={setAgregadoCajaCentro}
          agregadoCajaBrazo={agregadoCajaBrazo}
          setAgregadoCajaBrazo={setAgregadoCajaBrazo}
          agregadoHEspecial={agregadoHEspecial}
          setAgregadoHEspecial={setAgregadoHEspecial}
          tipoTableroId={tipoTableroId}
          setTipoTableroId={setTipoTableroId}
          onCrear={handleCrearTablero}
          onPrecargar={handleNuevoConAnterior}
          modo={tableroEditando ? "editar" : "crear"}
          onCancelarEdicion={limpiarFormularioTablero}
        />
      </CollapsibleSection>

      <CollapsibleSection
        eyebrow="Listado"
        title="Tableros creados"
        defaultOpen={true}
        rightContent={
          <div className="workspace-badge">{tableros.length} tableros</div>
        }
      >
        {tableros.length === 0 ? (
          <EmptyState
            title="No hay tableros cargados"
            description="Crea el primer tablero de esta obra para comenzar con la configuración técnica."
          />
        ) : (
          <TablerosList
            tableros={tableros}
            tableroSeleccionado={tableroSeleccionado}
            onVerCircuitos={setTableroSeleccionado}
            onEditarTablero={handleEditarTablero}
            onTableroEliminado={(tableroId) => {
              setTableros((prev) =>
                prev.filter(
                  (tablero) => Number(tablero.id) !== Number(tableroId),
                ),
              );

              if (Number(tableroSeleccionado?.id) === Number(tableroId)) {
                setTableroSeleccionado(null);
              }

              if (Number(tableroEditando?.id) === Number(tableroId)) {
                limpiarFormularioTablero();
              }
            }}
          />
        )}
      </CollapsibleSection>

      {tableroSeleccionado && (
        <CollapsibleSection
          eyebrow="Detalle técnico"
          title={`Detalle de ${tableroSeleccionado.nombre}`}
          defaultOpen={true}
        >
          <TableroDetalle tablero={tableroSeleccionado} />
        </CollapsibleSection>
      )}
    </div>
  );
}

export default ObraDetallePage;
