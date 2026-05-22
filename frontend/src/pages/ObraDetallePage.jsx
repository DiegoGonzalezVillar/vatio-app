import { useEffect, useState } from "react";
import { getTableros, createTablero, getLastTablero } from "../services/api";

import TableroForm from "../components/TableroForm";
import TablerosList from "../components/TablerosList";
import TableroDetalle from "../components/TableroDetalle";

import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";

import CollapsibleSection from "../components/ui/CollapsibleSection";
import CircuitosPage from "./CircuitosPage";
import CanalizacionesPage from "./CanalizacionesPage";
import TerminacionesPage from "./TerminacionesPage";
import PuestaATierraPage from "./PuestaATierraPage";
import TablerosMaterialesPage from "./TablerosMaterialesPage";
import LuminariasPage from "./LuminariasPage";
import BandejasPage from "./BandejasPage";
import DuctosPage from "./DuctosPage";
import PorterosPage from "./PorterosPage";
import ObraResumenPage from "./ObraResumenPage";


function ObraDetallePage({ obra, onBack }) {
  const [tableros, setTableros] = useState([]);
  const [tableroSeleccionado, setTableroSeleccionado] = useState(null);
  const [moduloActivo, setModuloActivo] = useState(null);
  const [tableroModulo, setTableroModulo] = useState(null);
  const [modulosObraOpen, setModulosObraOpen] = useState(true);

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
  const [extraPorVigas, setExtraPorVigas] = useState("");
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
    setExtraPorVigas("");
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
      extra_por_vigas: extraPorVigas,
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
    setExtraPorVigas(ultimo.extra_por_vigas || "");
    setTipoTableroId(ultimo.tipo_tablero_id || 1);
  };

  const abrirModulo = (modulo, tablero = null) => {
    setModuloActivo(modulo);
    setTableroModulo(tablero);
  };

  const cerrarModulo = () => {
    setModuloActivo(null);
    setTableroModulo(null);
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

  if (moduloActivo) {
    const propsObra = { obra, onBack: cerrarModulo };
    if (moduloActivo === "circuitos-electrica") return <CircuitosPage tablero={tableroModulo} tipo="electrica" onBack={cerrarModulo} />;
    if (moduloActivo === "circuitos-debiles") return <CircuitosPage tablero={tableroModulo} tipo="debiles" onBack={cerrarModulo} />;
    if (moduloActivo === "canalizaciones") return <CanalizacionesPage {...propsObra} />;
    if (moduloActivo === "terminaciones-electrica") return <TerminacionesPage obra={obra} tipo="electrica" onBack={cerrarModulo} />;
    if (moduloActivo === "terminaciones-debiles") return <TerminacionesPage obra={obra} tipo="debiles" onBack={cerrarModulo} />;
    if (moduloActivo === "puesta-a-tierra") return <PuestaATierraPage {...propsObra} />;
    if (moduloActivo === "tableros-materiales") return <TablerosMaterialesPage {...propsObra} />;
    if (moduloActivo === "luminarias") return <LuminariasPage {...propsObra} />;
    if (moduloActivo === "bandejas") return <BandejasPage {...propsObra} />;
    if (moduloActivo === "ductos") return <DuctosPage {...propsObra} />;
    if (moduloActivo === "porteros") return <PorterosPage {...propsObra} />;
    if (moduloActivo === "resumen-obra") return <ObraResumenPage {...propsObra} />;
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

      <CollapsibleSection
        eyebrow="Configuración"
        title="Crear tablero"
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
          extraPorVigas={extraPorVigas}
          setExtraPorVigas={setExtraPorVigas}
          tipoTableroId={tipoTableroId}
          setTipoTableroId={setTipoTableroId}
          onCrear={handleCrearTablero}
          onPrecargar={handleNuevoConAnterior}
        />
      </CollapsibleSection>

      <section className={`obra-modulos-globales page-card ${modulosObraOpen ? "is-open" : "is-closed"}`}>
        <button
          type="button"
          className="obra-modulos-header"
          onClick={() => setModulosObraOpen((current) => !current)}
          aria-expanded={modulosObraOpen}
        >
          <span className="obra-modulos-title-wrap">
            <span className="eyebrow">Módulos de obra</span>
            <strong>Módulos disponibles</strong>
          </span>
          <span className="obra-modulos-count">10 módulos</span>
          <span className={`collapse-icon ${modulosObraOpen ? "open" : ""}`}>⌄</span>
        </button>

        {modulosObraOpen && (
          <div className="detalle-modulos-grid">
            {[
              ["resumen-obra", "Resumen general", "Control de obra"],
              ["canalizaciones", "Canalizaciones", "A1+B1 automático"],
              ["terminaciones-electrica", "Terminaciones eléctrica", "A2"],
              ["terminaciones-debiles", "Terminaciones T. débiles", "B2"],
              ["puesta-a-tierra", "Puesta a tierra", "A3"],
              ["tableros-materiales", "Tableros materiales", "C1"],
              ["luminarias", "Luminarias", "E1"],
              ["bandejas", "Bandejas", "AB1"],
              ["ductos", "Ductos", "AB2"],
              ["porteros", "Porteros", "porteros"],
            ].map(([key, title, desc]) => (
              <article className="detalle-modulo-card" key={key}>
                <h4>{title}</h4>
                <p>{desc}</p>
                <button className="open-mini-btn blue" onClick={() => abrirModulo(key)}>→ Abrir</button>
              </article>
            ))}
          </div>
        )}
      </section>

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
          />
        )}
      </CollapsibleSection>

      {tableroSeleccionado && (
        <CollapsibleSection
          eyebrow="Detalle técnico"
          title={`Detalle de ${tableroSeleccionado.nombre}`}
          defaultOpen={true}
        >
          <TableroDetalle tablero={tableroSeleccionado} onOpenModule={abrirModulo} />
        </CollapsibleSection>
      )}
    </div>
  );
}

export default ObraDetallePage;
