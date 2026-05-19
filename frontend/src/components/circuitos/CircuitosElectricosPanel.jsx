import { useEffect, useState } from "react";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";
import {
  getCircuitosElectricosByTablero,
  createCircuitoElectrico,
  deleteCircuitoElectrico,
} from "../../services/api";

import { calcularDatosTablero } from "../../utils/calculosDatosTablero";
import { calcularCircuitoElectrico } from "../../utils/calcularCircuitoElectrico";

const initialForm = {
  numero_circuito: "",
  conductores: "",
  proteccion: "",
  salida_a_piso: false,
  salida_por_bandeja: false,

  tipo_canalizacion: "",
  diametro_cano: "",
  instalacion: "",
  metros_losa: "",
  metros_bandeja: "",

  tipo_caja: "",
  aparente: false,
  material_caja: "",
  cantidad_cajas: "",

  terminacion: "",
  cantidad_terminacion: "",

  finalizado: false,
};

const crearBajadaVacia = () => ({
  id: crypto.randomUUID(),
  tipo_cano: "",
  diametro: "",
  material: "",
  bajada_a: "",
  cantidad: "",
  picadas: "",
  codos: "",
});

function CircuitosElectricosPanel({ obraId, tablero }) {
  const [circuitos, setCircuitos] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [bajadas, setBajadas] = useState([]);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const [accesorios, setAccesorios] = useState([]);
  const [terminaciones, setTerminaciones] = useState([]);

  const cablePorBandeja = Number(form.metros_bandeja || 0);

  const datosTablero = calcularDatosTablero(tablero);

  const resumenCircuito = calcularCircuitoElectrico(
    {
      metros_bandeja: form.metros_bandeja,
      metros_losa: form.metros_losa,
      metros_saltos_pared: form.metros_saltos_pared,

      caja_piso:
        form.tipo_caja === "Caja Piso" ? Number(form.cantidad_cajas || 0) : 0,

      caja_honda:
        form.tipo_caja === "Caja Honda" ? Number(form.cantidad_cajas || 0) : 0,

      caja_llana:
        form.tipo_caja === "Caja Llana" ? Number(form.cantidad_cajas || 0) : 0,

      centro:
        form.tipo_caja === "Caja Centro" ? Number(form.cantidad_cajas || 0) : 0,

      brazo:
        form.tipo_caja === "Caja Brazo" ? Number(form.cantidad_cajas || 0) : 0,

      bajada_tomas: bajadas
        .filter((b) => b.bajada_a === "Toma")
        .reduce((acc, b) => acc + Number(b.cantidad || 0), 0),

      bajada_luces: bajadas
        .filter((b) => b.bajada_a === "Llave")
        .reduce((acc, b) => acc + Number(b.cantidad || 0), 0),

      codos_especiales: bajadas.reduce(
        (acc, b) => acc + Number(b.codos || 0),
        0,
      ),
    },
    datosTablero,
  );

  const crearTerminacionVacia = () => ({
    id: crypto.randomUUID(),
    terminacion: "",
    cantidad: "",
  });

  const handleAgregarTerminacion = () => {
    setTerminaciones((prev) => [...prev, crearTerminacionVacia()]);
  };

  const handleEliminarTerminacion = (id) => {
    setTerminaciones((prev) => prev.filter((item) => item.id !== id));
  };

  const handleChangeTerminacion = (id, field, value) => {
    setTerminaciones((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };
  const crearAccesorioVacio = () => ({
    id: crypto.randomUUID(),
    accesorio: "",
    cantidad: "",
    material: "",
  });

  const handleAgregarAccesorio = () => {
    setAccesorios((prev) => [...prev, crearAccesorioVacio()]);
  };

  const handleEliminarAccesorio = (id) => {
    setAccesorios((prev) => prev.filter((item) => item.id !== id));
  };

  const handleChangeAccesorio = (id, field, value) => {
    setAccesorios((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  useEffect(() => {
    if (!tablero?.id) return;

    let activo = true;

    async function cargarCircuitos() {
      try {
        setCargando(true);

        const data = await getCircuitosElectricosByTablero(tablero.id);

        if (activo) {
          setCircuitos(data);
          setError("");
        }
      } catch (err) {
        console.error(err);

        if (activo) {
          setError("No se pudieron cargar los circuitos eléctricos.");
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    cargarCircuitos();

    return () => {
      activo = false;
    };
  }, [tablero?.id]);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAgregarBajada = () => {
    setBajadas((prev) => [...prev, crearBajadaVacia()]);
  };

  const handleEliminarBajada = (id) => {
    setBajadas((prev) => prev.filter((bajada) => bajada.id !== id));
  };

  const handleChangeBajada = (id, field, value) => {
    setBajadas((prev) =>
      prev.map((bajada) =>
        bajada.id === id ? { ...bajada, [field]: value } : bajada,
      ),
    );
  };

  const handleCrearCircuito = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.numero_circuito.trim()) {
      setError("El número de circuito es obligatorio.");
      return;
    }

    try {
      setGuardando(true);

      const nuevoCircuito = await createCircuitoElectrico({
        obra_id: obraId,
        tablero_id: tablero.id,
        ...form,
        bajadas,
        accesorios,
        terminaciones,
      });

      setCircuitos((prev) => [...prev, nuevoCircuito]);
      setForm(initialForm);
      setBajadas([]);
      setAccesorios([]);
      setTerminaciones([]);
    } catch (err) {
      console.error(err);
      setError("No se pudo crear el circuito eléctrico.");
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminarCircuito = async (id) => {
    const confirmar = window.confirm("¿Eliminar este circuito eléctrico?");
    if (!confirmar) return;

    try {
      await deleteCircuitoElectrico(id);
      setCircuitos((prev) => prev.filter((circuito) => circuito.id !== id));
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar el circuito.");
    }
  };

  return (
    <div className="circuitos-panel">
      {error && <div className="form-error">{error}</div>}

      <form className="crear-circuito-layout" onSubmit={handleCrearCircuito}>
        <div className="crear-circuito-main">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Metrado eléctrica</p>
              <h2>Crear circuito</h2>
              <p>Carga los datos técnicos del circuito eléctrico.</p>
            </div>
          </div>

          <section className="circuito-section">
            <div className="crear-obra-grid five">
              <div className="form-field">
                <label>Nombre</label>
                <input
                  value={form.numero_circuito}
                  onChange={(e) =>
                    handleChange("numero_circuito", e.target.value)
                  }
                  placeholder="Ej: Circuito nuevo"
                />
              </div>

              <div className="form-field">
                <label>Conductores</label>
                <select
                  value={form.conductores}
                  onChange={(e) => handleChange("conductores", e.target.value)}
                >
                  <option value="">Seleccionar conductor</option>
                  <option value="CF1 II">CF1 II</option>
                  <option value="CF1 III">CF1 III</option>
                  <option value="CF1 IV">CF1 IV</option>
                  <option value="CF2 II">CF2 II</option>
                  <option value="CF2 III">CF2 III</option>
                  <option value="CF2 IV">CF2 IV</option>
                  <option value="CF4 II">CF4 II</option>
                  <option value="CF4 III">CF4 III</option>
                  <option value="CF4 IV">CF4 IV</option>
                  <option value="CF6 II">CF6 II</option>
                  <option value="CF6 III">CF6 III</option>
                  <option value="CF6 IV">CF6 IV</option>
                  <option value="SP3x1">SP3x1</option>
                  <option value="SP3x1,5">SP3x1,5</option>
                  <option value="SP3x2">SP3x2</option>
                  <option value="SP3x4">SP3x4</option>
                  <option value="SP4x1,5">SP4x1,5</option>
                  <option value="SP5x2">SP5x2</option>
                  <option value="SP5x6">SP5x6</option>
                  <option value="SP5x10">SP5x10</option>
                  <option value="SP5x16">SP5x16</option>
                </select>
              </div>

              <div className="form-field">
                <label>Protección</label>
                <select
                  value={form.proteccion}
                  onChange={(e) => handleChange("proteccion", e.target.value)}
                >
                  <option value="">Sin Protección</option>
                  <option value="INT TQ 4P 63A EEEE">INT TQ 4P 63A EEEE</option>
                  <option value="INT DIF 2P 16 45">INT DIF 2P 16 45</option>
                  <option value="INT TQ 2P 40A test">INT TQ 2P 40A test</option>
                  <option value="INT TQ 2P 25A test2">
                    INT TQ 2P 25A test2
                  </option>
                  <option value="INT TQ 2P 40A">INT TQ 2P 40A</option>
                  <option value="INT TQ 3P 32Ahhh">INT TQ 3P 32Ahhh</option>
                  <option value="INT TQ 3P 32A hhh">INT TQ 3P 32A hhh</option>
                  <option value="INT TQ 4P 80A 6KA">INT TQ 4P 80A 6KA</option>
                </select>
              </div>

              <label className="checkbox-field">
                <span>Salida a piso</span>
                <input
                  type="checkbox"
                  checked={form.salida_a_piso}
                  onChange={(e) =>
                    handleChange("salida_a_piso", e.target.checked)
                  }
                />
              </label>

              <label className="checkbox-field">
                <span>Salida por Bandeja</span>
                <input
                  type="checkbox"
                  checked={form.salida_por_bandeja}
                  onChange={(e) =>
                    handleChange("salida_por_bandeja", e.target.checked)
                  }
                />
              </label>
            </div>
          </section>

          <section className="circuito-section">
            <div className="circuito-section-title">› Canalizaciones</div>

            <div className="crear-obra-grid four">
              <div className="form-field">
                <label>Tipo Caño</label>
                <select
                  value={form.tipo_canalizacion}
                  onChange={(e) =>
                    handleChange("tipo_canalizacion", e.target.value)
                  }
                >
                  <option value="">Seleccionar</option>
                  <option value="Corrugado 205">Corrugado 205</option>
                  <option value="Corrugado 305">Corrugado 305</option>
                  <option value="PVC 205">PVC 205</option>
                  <option value="PVC 305">PVC 305</option>
                  <option value="Galvanizado 205">Galvanizado 205</option>
                  <option value="Galvanizado 305">Galvanizado 305</option>
                </select>
              </div>

              <div className="form-field">
                <label>Diámetro</label>
                <select
                  value={form.diametro_cano}
                  onChange={(e) =>
                    handleChange("diametro_cano", e.target.value)
                  }
                >
                  <option value="">Seleccionar</option>
                  <option value="16">Ø16</option>
                  <option value="20">Ø20</option>
                  <option value="25">Ø25</option>
                  <option value="32">Ø32</option>
                  <option value="40">Ø40</option>
                  <option value="50">Ø50</option>
                  <option value="63">Ø63</option>
                  <option value="110">Ø110</option>
                </select>
              </div>

              <div className="form-field">
                <label>Instalación</label>
                <select
                  value={form.instalacion}
                  onChange={(e) => handleChange("instalacion", e.target.value)}
                >
                  <option value="">Seleccionar</option>
                  <option value="Losa">Losa</option>
                  <option value="Techo">Techo</option>
                  <option value="Cielorraso">Cielorraso</option>
                  <option value="Muro">Muro</option>
                  <option value="Piso">Piso</option>
                  <option value="Metal">Metal</option>
                </select>
              </div>

              <div className="form-field">
                <label>Metros</label>
                <input
                  type="number"
                  value={form.metros_losa}
                  onChange={(e) => handleChange("metros_losa", e.target.value)}
                />
              </div>
            </div>

            <div className="canalizacion-actions">
              <button
                type="button"
                className="inline-action-btn"
                onClick={handleAgregarBajada}
              >
                Bajada +
              </button>
            </div>

            {bajadas.map((bajada) => (
              <div className="bajada-wrapper" key={bajada.id}>
                <button type="button" className="inline-toggle-btn">
                  › Bajada
                </button>

                <div className="bajada-box">
                  <div className="crear-obra-grid seven">
                    <div className="form-field">
                      <label>Tipo Caño</label>
                      <select
                        value={bajada.tipo_cano}
                        onChange={(e) =>
                          handleChangeBajada(
                            bajada.id,
                            "tipo_cano",
                            e.target.value,
                          )
                        }
                      >
                        <option value=""></option>
                        <option value="Corrugado 205">Corrugado 205</option>
                        <option value="Corrugado 305">Corrugado 305</option>
                        <option value="PVC 205">PVC 205</option>
                        <option value="PVC 305">PVC 305</option>
                        <option value="Galvanizado 205">Galvanizado 205</option>
                        <option value="Galvanizado 305">Galvanizado 305</option>
                      </select>
                    </div>

                    <div className="form-field">
                      <label>Diámetro</label>
                      <select
                        value={bajada.diametro}
                        onChange={(e) =>
                          handleChangeBajada(
                            bajada.id,
                            "diametro",
                            e.target.value,
                          )
                        }
                      >
                        <option value=""></option>
                        <option value="16">Ø16</option>
                        <option value="20">Ø20</option>
                        <option value="25">Ø25</option>
                        <option value="32">Ø32</option>
                        <option value="40">Ø40</option>
                        <option value="50">Ø50</option>
                        <option value="63">Ø63</option>
                        <option value="110">Ø110</option>
                      </select>
                    </div>

                    <div className="form-field">
                      <label>Material</label>
                      <select
                        value={bajada.material}
                        onChange={(e) =>
                          handleChangeBajada(
                            bajada.id,
                            "material",
                            e.target.value,
                          )
                        }
                      >
                        <option value=""></option>
                        <option value="PVC">PVC</option>
                        <option value="Metálico">Metálico</option>
                        <option value="Corrugado">Corrugado</option>
                      </select>
                    </div>

                    <div className="form-field">
                      <label>Bajada a</label>
                      <select
                        value={bajada.bajada_a}
                        onChange={(e) =>
                          handleChangeBajada(
                            bajada.id,
                            "bajada_a",
                            e.target.value,
                          )
                        }
                      >
                        <option value=""></option>
                        <option value="Toma">Toma</option>
                        <option value="Llave">Llave</option>
                        <option value="Tablero">Tablero</option>
                        <option value="Brazo">Brazo</option>
                        <option value="Especial">Especial</option>
                      </select>
                    </div>

                    <div className="form-field">
                      <label>Cantidad</label>
                      <input
                        type="number"
                        value={bajada.cantidad}
                        onChange={(e) =>
                          handleChangeBajada(
                            bajada.id,
                            "cantidad",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="form-field">
                      <label>Picadas</label>
                      <input
                        type="number"
                        value={bajada.picadas}
                        onChange={(e) =>
                          handleChangeBajada(
                            bajada.id,
                            "picadas",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="form-field">
                      <label>Codos</label>
                      <input
                        type="number"
                        value={bajada.codos}
                        onChange={(e) =>
                          handleChangeBajada(bajada.id, "codos", e.target.value)
                        }
                      />
                    </div>

                    <button
                      type="button"
                      className="round-danger-btn"
                      onClick={() => handleEliminarBajada(bajada.id)}
                    >
                      −
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="por-bandeja-row">
              <span>Por Bandeja</span>
              <input
                type="number"
                value={form.metros_bandeja}
                onChange={(e) => handleChange("metros_bandeja", e.target.value)}
              />
            </div>
          </section>

          <section className="circuito-section">
            <div className="circuito-section-title">› Cajas</div>

            <div className="crear-obra-grid four">
              <div className="form-field">
                <label>Tipo Caja</label>
                <select
                  value={form.tipo_caja}
                  onChange={(e) => handleChange("tipo_caja", e.target.value)}
                >
                  <option value="Seleccionar">Seleccionar</option>
                  <option value="Caja Honda">Caja Honda</option>

                  <option value="Caja Llana">Caja Llana</option>

                  <option value="Caja Centro">Caja Centro</option>

                  <option value="Caja Brazo">Caja Brazo</option>

                  <option value="Registro 10x10">Registro 10x10</option>

                  <option value="Registro 15x20">Registro 15x20</option>

                  <option value="Registro 25x35">Registro 25x35</option>

                  <option value="Registro 40x50">Registro 40x50</option>

                  <option value="Camara 20x20">Camara 20x20</option>

                  <option value="Camara 40x40">Camara 40x40</option>

                  <option value="Camara 60x60">Camara 60x60</option>

                  <option value="Camara 60x100">Camara 60x100</option>
                </select>
              </div>

              <label className="checkbox-field">
                <span>Aparente</span>
                <input
                  type="checkbox"
                  checked={form.aparente}
                  onChange={(e) => handleChange("aparente", e.target.checked)}
                />
              </label>

              <div className="form-field">
                <label>Material</label>
                <select
                  value={form.material_caja}
                  onChange={(e) =>
                    handleChange("material_caja", e.target.value)
                  }
                >
                  <option value="">Seleccionar</option>
                  <option value="PVC">PVC</option>
                  <option value="Metálica">Metal</option>
                </select>
              </div>

              <div className="form-field">
                <label>Cantidad</label>
                <input
                  type="number"
                  value={form.cantidad_cajas}
                  onChange={(e) =>
                    handleChange("cantidad_cajas", e.target.value)
                  }
                />
              </div>
            </div>
            <button
              type="button"
              className="circle-add-btn"
              onClick={handleAgregarAccesorio}
            >
              +
            </button>
          </section>

          {accesorios.map((item) => (
            <div className="accesorio-box" key={item.id}>
              <div className="crear-obra-grid accesorios-grid">
                <div className="form-field">
                  <label>Accesorios</label>

                  <select
                    value={item.accesorio}
                    onChange={(e) =>
                      handleChangeAccesorio(
                        item.id,
                        "accesorio",
                        e.target.value,
                      )
                    }
                  >
                    <option value=""></option>

                    <option value="Conector">Conector</option>

                    <option value="Curva">Curva</option>

                    <option value="Cupla">Cupla</option>

                    <option value="Boquilla">Boquilla</option>

                    <option value="Tuerca">Tuerca</option>

                    <option value="Grapa">Grapa</option>

                    <option value="Precinto">Precinto</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Cantidad</label>

                  <input
                    type="number"
                    value={item.cantidad}
                    onChange={(e) =>
                      handleChangeAccesorio(item.id, "cantidad", e.target.value)
                    }
                  />
                </div>

                <div className="form-field">
                  <label>Material</label>

                  <select
                    value={item.material}
                    onChange={(e) =>
                      handleChangeAccesorio(item.id, "material", e.target.value)
                    }
                  >
                    <option value=""></option>

                    <option value="PVC">PVC</option>

                    <option value="Galvanizado">Galvanizado</option>

                    <option value="Corrugado">Corrugado</option>
                  </select>
                </div>

                <button
                  type="button"
                  className="round-danger-btn"
                  onClick={() => handleEliminarAccesorio(item.id)}
                >
                  −
                </button>
              </div>
            </div>
          ))}

          <section className="circuito-section">
            <div className="circuito-section-title-wrapper">
              <div className="circuito-section-title">› Terminación</div>

              <button
                type="button"
                className="circle-add-btn"
                onClick={handleAgregarTerminacion}
              >
                +
              </button>
            </div>

            {terminaciones.map((item) => (
              <div className="terminacion-box" key={item.id}>
                <div className="crear-obra-grid terminaciones-grid">
                  <div className="form-field">
                    <label>Terminación</label>

                    <select
                      value={item.terminacion}
                      onChange={(e) =>
                        handleChangeTerminacion(
                          item.id,
                          "terminacion",
                          e.target.value,
                        )
                      }
                    >
                      <option value=""></option>

                      <option value="INTERRUPTOR PULSADOR">
                        INTERRUPTOR PULSADOR
                      </option>

                      <option value="INTERRUPTOR UNIPOLAR">
                        INTERRUPTOR UNIPOLAR
                      </option>

                      <option value="INTERRUPTOR UNIPOLAR 2S">
                        INTERRUPTOR UNIPOLAR 2S
                      </option>

                      <option value="MOTOR PARA BOMBA CON BOTONERA PARA DUCTO">
                        MOTOR PARA BOMBA CON BOTONERA PARA DUCTO
                      </option>

                      <option value="INTERRUPTOR UNIPOLAR 3S">
                        INTERRUPTOR UNIPOLAR 3S
                      </option>

                      <option value="COMBINACION + UNIPOLAR">
                        COMBINACION + UNIPOLAR
                      </option>

                      <option value="INTERRUPTOR U. DE COMBINACION">
                        INTERRUPTOR U. DE COMBINACION
                      </option>

                      <option value="SENSOR DE MOVIMIENTO PARA LUZ">
                        SENSOR DE MOVIMIENTO PARA LUZ
                      </option>

                      <option value="TIMBRE">TIMBRE</option>

                      <option value="TOMACORRIENTE SCHUCKO">
                        TOMACORRIENTE SCHUCKO
                      </option>

                      <option value="TOMACORRIENTE USA">
                        TOMACORRIENTE USA
                      </option>

                      <option value="TOMACORRIENTE C/BIPOLAR">
                        TOMACORRIENTE C/BIPOLAR
                      </option>

                      <option value="TOMACORRIENTE INDUSTRIAL PARA DUCTO">
                        TOMACORRIENTE INDUSTRIAL PARA DUCTO
                      </option>

                      <option value="TC PARA DUCTO">TC PARA DUCTO</option>

                      <option value="TC EMBUTIDO CIELORRASO">
                        TC EMBUTIDO CIELORRASO
                      </option>

                      <option value="INTERRUPTOR BIPOLAR">
                        INTERRUPTOR BIPOLAR
                      </option>

                      <option value="CONEXION A. ACONDICIONADO">
                        CONEXION A. ACONDICIONADO
                      </option>

                      <option value="SCHUKO EN CIELORRASO">
                        SCHUKO EN CIELORRASO
                      </option>

                      <option value="TC 3 EN LINEA">TC 3 EN LINEA</option>

                      <option value="CAJA CENTRO LUMINARIA">
                        CAJA CENTRO LUMINARIA
                      </option>

                      <option value="CAJA PARA TUBO DE LUZ">
                        CAJA PARA TUBO DE LUZ
                      </option>

                      <option value="CAJA PARA ARTEFACTO">
                        CAJA PARA ARTEFACTO
                      </option>

                      <option value="ART DE EMB DOBLE">ART DE EMB DOBLE</option>

                      <option value="CENTRO DICROICA">CENTRO DICROICA</option>

                      <option value="EMBUTIDO BAJO CONSUMO">
                        EMBUTIDO BAJO CONSUMO
                      </option>

                      <option value="LUZ DE EMERGENCIA">
                        LUZ DE EMERGENCIA
                      </option>

                      <option value="LUZ DE SALIDA EMERGENCIA">
                        LUZ DE SALIDA EMERGENCIA
                      </option>

                      <option value="SENSOR 180">SENSOR 180</option>

                      <option value="LED DE PISO PARA LUMINARIA 10">
                        LED DE PISO PARA LUMINARIA 10
                      </option>

                      <option value="LED DE PISO PARA LUMINARIA 6">
                        LED DE PISO PARA LUMINARIA 6
                      </option>

                      <option value="CONEXION FIJA">CONEXION FIJA</option>

                      <option value="VENTILADOR - EXTRACTOR">
                        VENTILADOR - EXTRACTOR
                      </option>

                      <option value="CAJA TUBO LUMINARIA">
                        CAJA TUBO LUMINARIA
                      </option>

                      <option value="CAJA BRAZO LUMINARIA">
                        CAJA BRAZO LUMINARIA
                      </option>

                      <option value="INDICADOR ESC. DE EMERGENCIA">
                        INDICADOR ESC. DE EMERGENCIA
                      </option>

                      <option value="FLECHA LED DE EMERGENCIA">
                        FLECHA LED DE EMERGENCIA
                      </option>

                      <option value="LUZ SALIDA DE GARAGE">
                        LUZ SALIDA DE GARAGE
                      </option>

                      <option value="Tablero Portero Electrico">
                        Tablero Portero Electrico
                      </option>

                      <option value="Termostato">Termostato</option>

                      <option value="TOMA SCHUKO + 3 EN LINEA">
                        TOMA SCHUKO + 3 EN LINEA
                      </option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label>Cantidad</label>

                    <input
                      type="number"
                      value={item.cantidad}
                      onChange={(e) =>
                        handleChangeTerminacion(
                          item.id,
                          "cantidad",
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  <button
                    type="button"
                    className="round-danger-btn"
                    onClick={() => handleEliminarTerminacion(item.id)}
                  >
                    −
                  </button>
                </div>
              </div>
            ))}
          </section>

          <label className="checkbox-field circuito-finalizado">
            <span>Circuito finalizado</span>
            <input
              type="checkbox"
              checked={form.finalizado}
              onChange={(e) => handleChange("finalizado", e.target.checked)}
            />
          </label>

          <div className="crear-obra-actions">
            <Button variant="primary" type="submit" disabled={guardando}>
              {guardando ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </div>

        <aside className="crear-circuito-sidebar page-card">
          <p className="eyebrow">Resumen</p>
          <h3>Tablero {tablero?.nombre}</h3>
          <h4>Circuito {form.numero_circuito || "nuevo"}</h4>

          <div className="crear-obra-sidebar-list">
            <div className="summary-item">
              <small>Caño por Techo</small>
              <strong>{resumenCircuito.total_cano_losa}</strong>
            </div>

            <div className="summary-item">
              <small>Caño por Pared</small>
              <strong>{resumenCircuito.total_cano_pared}</strong>
            </div>

            <div className="summary-item">
              <small>Metros de Cable</small>
              <strong>{resumenCircuito.total_cable}</strong>
            </div>

            <div className="summary-item">
              <small>Cable por Bandeja</small>
              <strong>{cablePorBandeja}</strong>
            </div>

            <div className="summary-item">
              <small>Metros de Picada</small>
              <strong>
                {Number(
                  resumenCircuito.total_bajada_tomas +
                    resumenCircuito.total_bajada_luces,
                )}
              </strong>
            </div>

            <div className="summary-item">
              <small>Metros Picada por Yeso</small>
              <strong>{resumenCircuito.total_bajada_luces}</strong>
            </div>

            <div className="summary-item">
              <small>Metros Picada por Zanja</small>
              <strong>{resumenCircuito.total_bajada_tomas}</strong>
            </div>
          </div>
        </aside>
      </form>

      <section className="page-card circuitos-list-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Circuitos cargados</p>
            <h3>{circuitos.length} circuitos eléctricos</h3>
          </div>
        </div>

        {cargando ? (
          <EmptyState
            title="Cargando circuitos..."
            description="Estamos obteniendo los circuitos del tablero."
          />
        ) : circuitos.length === 0 ? (
          <EmptyState
            title="No hay circuitos eléctricos"
            description="Agrega el primer circuito para comenzar el metrado."
          />
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nº</th>
                  <th>Conductores</th>
                  <th>Protección</th>
                  <th>Canalización</th>
                  <th>Ø Caño</th>
                  <th>Instalación</th>
                  <th>Metros</th>
                  <th>Bajadas</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {circuitos.map((circuito) => (
                  <tr key={circuito.id}>
                    <td>{circuito.numero_circuito}</td>
                    <td>{circuito.conductores || "-"}</td>
                    <td>{circuito.proteccion || "-"}</td>
                    <td>{circuito.tipo_canalizacion || "-"}</td>
                    <td>{circuito.diametro_cano || "-"}</td>
                    <td>{circuito.instalacion || "-"}</td>
                    <td>{circuito.metros_losa || 0}</td>
                    <td>{circuito.bajadas?.length || 0}</td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => handleEliminarCircuito(circuito.id)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default CircuitosElectricosPanel;
