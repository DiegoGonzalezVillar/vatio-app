import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import TableroForm from "../components/TableroForm";
import TablerosList from "../components/TablerosList";
import {
  getObras,
  getTableros,
  createTablero,
  getLastTablero,
} from "../services/api";

function TablerosPage() {
  const [obras, setObras] = useState([]);
  const [obraSeleccionada, setObraSeleccionada] = useState("");

  const [tableros, setTableros] = useState([]);

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

    async function cargarTableros() {
      const data = await getTableros(obraSeleccionada);
      setTableros(data);
    }

    cargarTableros();
  }, [obraSeleccionada]);

  const limpiarFormularioTablero = () => {
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

  const handleCrearTablero = async (e) => {
    e.preventDefault();

    if (!nombreTablero.trim()) return;

    await createTablero({
      obra_id: Number(obraSeleccionada),
      nombre: nombreTablero,
      tipo_tablero_id: 1,
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
    });

    limpiarFormularioTablero();

    const data = await getTableros(obraSeleccionada);
    setTableros(data);
  };

  const handleNuevoConAnterior = async () => {
    const ultimo = await getLastTablero(obraSeleccionada);

    if (!ultimo) {
      alert("No hay un tablero anterior para copiar");
      return;
    }

    setNombreTablero("");
    setAlturaLocal(ultimo.altura_local || "");
    setAlturaLlaveLuz(ultimo.altura_llave_luz || "");
    setAlturaToma(ultimo.altura_toma || "");
    setAlturaTablero(ultimo.altura_tablero || "");
  };

  return (
    <Layout>
      <h2>Tableros</h2>

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
        tipoTableroId={tipoTableroId}
        onCrear={handleCrearTablero}
        onPrecargar={handleNuevoConAnterior}
      />

      <hr />

      <TablerosList tableros={tableros} />
    </Layout>
  );
}

export default TablerosPage;
