import { useEffect, useState } from "react";
import { getTableros, createTablero, getLastTablero } from "../services/api";

import TableroForm from "../components/TableroForm";
import TablerosList from "../components/TablerosList";
import TableroDetalle from "../components/TableroDetalle";

import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";

function ObraDetallePage({ obra, onBack }) {
  const [tableros, setTableros] = useState([]);
  const [tableroSeleccionado, setTableroSeleccionado] = useState(null);

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

    async function cargarTablerosIniciales() {
      const data = await getTableros(obra.id);
      setTableros(data);
    }

    cargarTablerosIniciales();
  }, [obra]);

  const cargarTableros = async () => {
    const data = await getTableros(obra.id);
    setTableros(data);
  };

  const limpiarFormularioTablero = () => {
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

  const handleCrearTablero = async (e) => {
    e.preventDefault();

    if (!nombreTablero.trim()) {
      alert("Ingrese el nombre del tablero");
      return;
    }

    await createTablero({
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
    });

    limpiarFormularioTablero();
    cargarTableros();
  };

  const handleNuevoConAnterior = async () => {
    const ultimo = await getLastTablero(obra.id);

    if (!ultimo) {
      alert("No hay un tablero anterior para copiar");
      return;
    }

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

      <section className="page-card tablero-workspace">
        <div className="workspace-header">
          <div>
            <p className="eyebrow">Configuración</p>
            <h2>Tableros</h2>
            <p>
              Crea tableros manualmente o reutiliza la configuración técnica del
              último tablero cargado.
            </p>
          </div>

          <div className="workspace-badge">{tableros.length} tableros</div>
        </div>

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
        />

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
          />
        )}
      </section>

      <TableroDetalle tablero={tableroSeleccionado} />
    </div>
  );
}

export default ObraDetallePage;
