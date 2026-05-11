import { useEffect, useState } from "react";
import { getTableros, createTablero, getLastTablero } from "../services/api";
import TableroForm from "../components/TableroForm";
import TablerosList from "../components/TablerosList";
import TableroDetalle from "../components/TableroDetalle";

function ObraDetallePage({ obra, onBack }) {
  const [tableros, setTableros] = useState([]);

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

  const [tableroSeleccionado, setTableroSeleccionado] = useState(null);

  useEffect(() => {
    if (!obra?.id) return;

    async function cargarTableros() {
      const data = await getTableros(obra.id);
      setTableros(data);
    }

    cargarTableros();
  }, [obra]);

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

  const cargarTableros = async () => {
    const data = await getTableros(obra.id);
    setTableros(data);
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
      <div className="page-card">
        <h2>No hay obra seleccionada</h2>
        <button className="btn-secondary" onClick={onBack}>
          ← Volver
        </button>
      </div>
    );
  }

  return (
    <div className="obra-detalle-page">
      <div className="page-card">
        <button className="btn-secondary" onClick={onBack}>
          ← Volver a obras
        </button>

        <div className="obra-header">
          <div>
            <p className="eyebrow">Detalle de obra</p>
            <h2>{obra.nombre}</h2>
          </div>
        </div>

        <div className="obra-info-grid">
          <div>
            <span>Contacto</span>
            <strong>{obra.nombre_contacto || "-"}</strong>
          </div>

          <div>
            <span>Teléfono</span>
            <strong>{obra.telefono_contacto || "-"}</strong>
          </div>

          <div>
            <span>Email</span>
            <strong>{obra.email_contacto || "-"}</strong>
          </div>

          <div>
            <span>Ubicación</span>
            <strong>{obra.ubicacion || "-"}</strong>
          </div>
        </div>
      </div>

      <div className="page-card">
        <div className="section-header">
          <div>
            <p className="eyebrow">Configuración</p>
            <h2>Tableros</h2>
          </div>
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

        <TablerosList
          tableros={tableros}
          onVerCircuitos={setTableroSeleccionado}
        />

        <TableroDetalle tablero={tableroSeleccionado} />
      </div>
    </div>
  );
}

export default ObraDetallePage;
