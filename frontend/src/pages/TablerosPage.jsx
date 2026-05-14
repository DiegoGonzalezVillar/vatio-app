import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import TableroForm from "../components/TableroForm";
import TablerosList from "../components/TablerosList";

import {
  getObras,
  getTableros,
  createTablero,
  updateTablero,
  getLastTablero,
} from "../services/api";

function TablerosPage() {
  const [obras, setObras] = useState([]);
  const [obraSeleccionada, setObraSeleccionada] = useState("");

  const [tableros, setTableros] = useState([]);
  const [tableroSeleccionado, setTableroSeleccionado] = useState(null);
  const [tableroEditando, setTableroEditando] = useState(null);

  const [nombreTablero, setNombreTablero] = useState("");
  const [alturaLocal, setAlturaLocal] = useState("");
  const [alturaLlaveLuz, setAlturaLlaveLuz] = useState("");
  const [alturaToma, setAlturaToma] = useState("");
  const [alturaTablero, setAlturaTablero] = useState("");
  const [alturaBrazo, setAlturaBrazo] = useState("");
  const [alturaEspecial, setAlturaEspecial] = useState("");
  const [agregadoCajaHonda, setAgregadoCajaHonda] = useState("");
  const [agregadoCajaCentro, setAgregadoCajaCentro] = useState("");
  const [agregadoCajaBrazo, setAgregadoCajaBrazo] = useState("");
  const [agregadoHEspecial, setAgregadoHEspecial] = useState("");
  const [tipoTableroId, setTipoTableroId] = useState(1);

  useEffect(() => {
    async function cargarObras() {
      const data = await getObras();

      setObras(data);

      if (data.length > 0) {
        setObraSeleccionada(data[0].id);
      }
    }

    cargarObras();
  }, []);

  useEffect(() => {
    if (!obraSeleccionada) return;

    let activo = true;

    async function fetchTableros() {
      const data = await getTableros(obraSeleccionada);

      if (activo) {
        setTableros(data);
        setTableroSeleccionado(null);
      }
    }

    fetchTableros();

    return () => {
      activo = false;
    };
  }, [obraSeleccionada]);

  const cargarTableros = async () => {
    if (!obraSeleccionada) return;

    const data = await getTableros(obraSeleccionada);
    setTableros(data);
  };

  const limpiarFormularioTablero = () => {
    setTableroEditando(null);

    setNombreTablero("");
    setAlturaLocal("");
    setAlturaLlaveLuz("");
    setAlturaToma("");
    setAlturaTablero("");
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
    setAlturaBrazo(tablero.altura_brazo || "");
    setAlturaEspecial(tablero.altura_especial || "");
    setAgregadoCajaHonda(tablero.agregado_caja_honda || "");
    setAgregadoCajaCentro(tablero.agregado_caja_centro || "");
    setAgregadoCajaBrazo(tablero.agregado_caja_brazo || "");
    setAgregadoHEspecial(tablero.agregado_h_especial || "");
    setTipoTableroId(tablero.tipo_tablero_id || 1);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleCrearTablero = async (e) => {
    e.preventDefault();

    if (!nombreTablero.trim()) return;

    const payload = {
      obra_id: Number(obraSeleccionada),
      nombre: nombreTablero,
      tipo_tablero_id: Number(tipoTableroId),
      altura_local: alturaLocal,
      altura_llave_luz: alturaLlaveLuz,
      altura_toma: alturaToma,
      altura_tablero: alturaTablero,
      altura_brazo: alturaBrazo,
      altura_especial: alturaEspecial,
      agregado_caja_honda: agregadoCajaHonda,
      agregado_caja_centro: agregadoCajaCentro,
      agregado_caja_brazo: agregadoCajaBrazo,
      agregado_h_especial: agregadoHEspecial,
    };

    if (tableroEditando) {
      await updateTablero(tableroEditando.id, payload);
    } else {
      await createTablero(payload);
    }

    limpiarFormularioTablero();

    await cargarTableros();
  };

  const handleNuevoConAnterior = async () => {
    const ultimo = await getLastTablero(obraSeleccionada);

    if (!ultimo) {
      return;
    }

    setTableroEditando(null);

    setNombreTablero("");
    setAlturaLocal(ultimo.altura_local || "");
    setAlturaLlaveLuz(ultimo.altura_llave_luz || "");
    setAlturaToma(ultimo.altura_toma || "");
    setAlturaTablero(ultimo.altura_tablero || "");
    setAlturaBrazo(ultimo.altura_brazo || "");
    setAlturaEspecial(ultimo.altura_especial || "");
    setAgregadoCajaHonda(ultimo.agregado_caja_honda || "");
    setAgregadoCajaCentro(ultimo.agregado_caja_centro || "");
    setAgregadoCajaBrazo(ultimo.agregado_caja_brazo || "");
    setAgregadoHEspecial(ultimo.agregado_h_especial || "");
    setTipoTableroId(ultimo.tipo_tablero_id || 1);
  };

  return (
    <Layout>
      <h2>{tableroEditando ? "Modificar tablero" : "Tableros"}</h2>

      <select
        value={obraSeleccionada}
        onChange={(e) => setObraSeleccionada(e.target.value)}
      >
        {obras.map((obra) => (
          <option key={obra.id} value={obra.id}>
            {obra.nombre}
          </option>
        ))}
      </select>

      <TableroForm
        nombreTablero={nombreTablero}
        setNombreTablero={setNombreTablero}
        alturaLocal={alturaLocal}
        setAlturaLocal={setAlturaLocal}
        alturaLlaveLuz={alturaLlaveLuz}
        setAlturaLlaveLuz={setAlturaLlaveLuz}
        alturaToma={alturaToma}
        setAlturaToma={setAlturaToma}
        alturaTablero={alturaTablero}
        setAlturaTablero={setAlturaTablero}
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

      <hr />

      <TablerosList
        tableros={tableros}
        tableroSeleccionado={tableroSeleccionado}
        onVerCircuitos={setTableroSeleccionado}
        onEditarTablero={handleEditarTablero}
        onTableroEliminado={(tableroId) => {
          setTableros((prev) =>
            prev.filter((tablero) => Number(tablero.id) !== Number(tableroId)),
          );

          if (Number(tableroSeleccionado?.id) === Number(tableroId)) {
            setTableroSeleccionado(null);
          }

          if (Number(tableroEditando?.id) === Number(tableroId)) {
            limpiarFormularioTablero();
          }
        }}
      />
    </Layout>
  );
}

export default TablerosPage;
