import { useEffect, useMemo, useState } from "react";
import ResumenCard from "../components/ResumenCard";
import {
  getBandejas,
  getCircuitosByObra,
  getDuctos,
  getLuminarias,
  getPorteros,
  getPuestaATierra,
  getTableros,
  getTablerosMateriales,
  getTerminaciones,
} from "../services/api";
import { calcularTotalesCircuitos } from "../utils/calculosCircuitos";
import { consolidarCanalizaciones } from "../utils/calculosCanalizaciones";

const n = (value) => Number(value || 0);
const fmt = (value, digits = 2) => n(value).toLocaleString("es-UY", { minimumFractionDigits: digits, maximumFractionDigits: digits });
const fmt3 = (value) => fmt(value, 3);
const fmtCoef = (value) => n(value).toFixed(2).replace(".", ",");
const sumRows = (rows, field) => rows.reduce((acc, row) => acc + n(row[field]), 0);
const sumTerminacionesPorCaja = (rows = []) => {
  const total = { llana: 0, honda: 0, centro: 0, brazo: 0, camara: 0, registro: 0, otros: 0 };
  rows.forEach((row) => {
    const tipo = String(row.tipo_caja || row.tipoCaja || "otros").toLowerCase();
    const cantidad = n(row.cantidad);
    if (tipo.includes("llana")) total.llana += cantidad;
    else if (tipo.includes("honda")) total.honda += cantidad;
    else if (tipo.includes("centro")) total.centro += cantidad;
    else if (tipo.includes("brazo")) total.brazo += cantidad;
    else if (tipo.includes("camara") || tipo.includes("cámara")) total.camara += cantidad;
    else if (tipo.includes("registro")) total.registro += cantidad;
    else total.otros += cantidad;
  });
  return total;
};

const sumBandejasTapas = (rows = []) => rows.reduce((acc, row) => {
  const tieneTapa = String(row.tapa || "").toLowerCase().startsWith("s");
  return acc + (tieneTapa ? n(row.metraje) : 0);
}, 0);

const sumBandejasAccesorios = (rows = []) => {
  const campos = [
    "curva_horizontal",
    "curva_articulada",
    "vertical_ext",
    "vertical_int",
    "cruces_h",
    "cruces_v",
    "descenso",
    "derivacion",
    "desvio_h",
    "desvio_h_izq",
    "desvio_h_der",
    "desvio_v",
  ];
  return rows.reduce((acc, row) => acc + campos.reduce((s, campo) => s + n(row[campo]), 0), 0);
};

const sumCaneria = (grupo = {}) => Object.values(grupo.losa || {}).reduce((s, v) => s + n(v), 0) + Object.values(grupo.pared || {}).reduce((s, v) => s + n(v), 0);
const tieneCajasCircuito = (totales = {}) => [totales.ch, totales.cll, totales.cc, totales.cb].some((value) => n(value) !== 0);

function ObraResumenPage({ obra, onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!obra?.id) return;
    async function cargar() {
      setLoading(true);
      setError("");
      try {
        const [
          tableros,
          circuitosElectrica,
          circuitosDebiles,
          terminacionesElectrica,
          terminacionesDebiles,
          puestaATierra,
          materialesTableros,
          luminarias,
          bandejas,
          ductos,
          porteros,
        ] = await Promise.all([
          getTableros(obra.id),
          getCircuitosByObra(obra.id, "electrica"),
          getCircuitosByObra(obra.id, "debiles"),
          getTerminaciones(obra.id, "electrica"),
          getTerminaciones(obra.id, "debiles"),
          getPuestaATierra(obra.id),
          getTablerosMateriales(obra.id),
          getLuminarias(obra.id),
          getBandejas(obra.id),
          getDuctos(obra.id),
          getPorteros(obra.id),
        ]);
        setData({ tableros, circuitosElectrica, circuitosDebiles, terminacionesElectrica, terminacionesDebiles, puestaATierra, materialesTableros, luminarias, bandejas, ductos, porteros });
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el resumen de obra.");
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, [obra]);

  const resumen = useMemo(() => {
    if (!data) return null;
    const totElectrica = calcularTotalesCircuitos(data.circuitosElectrica);
    const totDebiles = calcularTotalesCircuitos(data.circuitosDebiles);
    const coeficiente = Number(obra?.coeficiente_error_canalizaciones || 1.08);
    const canalizaciones = consolidarCanalizaciones(totElectrica, totDebiles, coeficiente);
    const porterosTotal = data.porteros.reduce((acc, item) => acc + n(item.cant) * n(item.precio), 0);
    const materialesTotal = data.materialesTableros.reduce((acc, item) => acc + n(item.cantidad) * n(item.precio_usd), 0);
    const luminariasTotal = sumRows(data.luminarias, "cantidad");
    const bandejasMetros = sumRows(data.bandejas, "metraje");
    const bandejasTapas = sumBandejasTapas(data.bandejas);
    const bandejasAccesorios = sumBandejasAccesorios(data.bandejas);
    const ductosMetros = sumRows(data.ductos, "metros");
    const ductosQuiebres = sumRows(data.ductos, "quiebres");
    const terminacionesElectricaPorCaja = sumTerminacionesPorCaja(data.terminacionesElectrica);
    const terminacionesDebilesPorCaja = sumTerminacionesPorCaja(data.terminacionesDebiles);
    const cañeriaConCoef = sumCaneria(canalizaciones.total_con_coeficiente.corrugado) + sumCaneria(canalizaciones.total_con_coeficiente.galvanizado) + sumCaneria(canalizaciones.total_con_coeficiente.pvc);
    const picadasYeso = n(canalizaciones.picadas?.yeso);
    const picadasMamposteria = n(canalizaciones.picadas?.mamposteria);
    const picadaPiso = n(canalizaciones.picadas?.piso);
    const zanja = n(canalizaciones.picadas?.zanja);

    return {
      totElectrica,
      totDebiles,
      canalizaciones,
      porterosTotal,
      materialesTotal,
      luminariasTotal,
      bandejasMetros,
      bandejasTapas,
      bandejasAccesorios,
      ductosMetros,
      ductosQuiebres,
      cañeriaConCoef,
      picadasYeso,
      picadasMamposteria,
      picadaPiso,
      zanja,
      coeficiente,
      terminacionesElectricaPorCaja,
      terminacionesDebilesPorCaja,
    };
  }, [data]);

  return (
    <div className="vatio-module resumen-page">
      <div className="vatio-module-head">
        <div>
          <p className="eyebrow">Resumen general</p>
          <h3>Resumen de obra — {obra?.nombre}</h3>
          <p>Vista consolidada para control rápido de módulos cargados y totales principales.</p>
        </div>
        <button className="btn-secondary" onClick={onBack}>← Volver</button>
      </div>

      {loading && <p>Cargando resumen...</p>}
      {error && <p className="vatio-alert">{error}</p>}

      {resumen && data && (
        <>
          <section className="resumen-grid">
            <ResumenCard label="Tableros" value={data.tableros.length} helper="Cantidad de tableros creados" />
            <ResumenCard label="Circuitos eléctrica" value={data.circuitosElectrica.length} helper={`${fmt3(resumen.totElectrica.cable_metros)} m de cable`} />
            <ResumenCard label="Circuitos T. débiles" value={data.circuitosDebiles.length} helper={`${fmt3(resumen.totDebiles.cable_metros)} m de cable`} />
            <ResumenCard label={`Cañería con coef. ${fmtCoef(resumen.coeficiente)}`} value={`${fmt3(resumen.cañeriaConCoef)} m`} helper="Suma canalizaciones consolidada" />
            <ResumenCard label="Picadas yeso" value={`${fmt3(resumen.picadasYeso)} m`} helper="Total de picadas en yeso" />
            <ResumenCard label="Picadas mampostería" value={`${fmt3(resumen.picadasMamposteria)} m`} helper="Total de picadas en mampostería" />
            <ResumenCard label="Picada piso" value={`${fmt3(resumen.picadaPiso)} m`} helper="Total de picada piso / contrapiso" />
            <ResumenCard label="Zanja" value={`${fmt3(resumen.zanja)} m`} helper="Total de zanja" />
            <ResumenCard label="Terminaciones eléctrica" value={sumRows(data.terminacionesElectrica, "cantidad")} helper="Total de unidades A2" />
            <ResumenCard label="Terminaciones T. débiles" value={sumRows(data.terminacionesDebiles, "cantidad")} helper="Total de unidades B2" />
            <ResumenCard label="Puesta a tierra" value={sumRows(data.puestaATierra, "cantidad")} helper="Suma simple de ítems A3" />
            <ResumenCard label="Luminarias" value={resumen.luminariasTotal} helper="Total general E1" />
            <ResumenCard label="Bandejas" value={`${fmt(resumen.bandejasMetros)} m`} helper="Metraje total AB1" />
            <ResumenCard label="Ductos" value={`${fmt(resumen.ductosMetros)} m`} helper={`${fmt(resumen.ductosQuiebres, 0)} quiebres`} />
            <ResumenCard label="Tableros materiales" value={`USD ${fmt(resumen.materialesTotal)}`} helper="Suma cantidad × precio" />
            <ResumenCard label="Porteros" value={`USD ${fmt(resumen.porterosTotal)}`} helper="Suma cantidad × precio" />
          </section>

          <section className="vatio-table-wrap">
            <table className="vatio-table resumen-table">
              <thead><tr><th>Dominio</th><th>Dato</th><th>Total</th></tr></thead>
              <tbody>
                {tieneCajasCircuito(resumen.totElectrica) && (
                  <tr>
                    <td>A1 Circuitos eléctrica</td>
                    <td>Cajas del circuito: honda / llana / centro / brazo</td>
                    <td>{resumen.totElectrica.ch} / {resumen.totElectrica.cll} / {resumen.totElectrica.cc} / {resumen.totElectrica.cb}</td>
                  </tr>
                )}
                {tieneCajasCircuito(resumen.totDebiles) && (
                  <tr>
                    <td>B1 Circuitos T. débiles</td>
                    <td>Cajas del circuito: honda / llana / centro / brazo</td>
                    <td>{resumen.totDebiles.ch} / {resumen.totDebiles.cll} / {resumen.totDebiles.cc} / {resumen.totDebiles.cb}</td>
                  </tr>
                )}
                <tr>
                  <td>A2 Terminaciones eléctrica</td>
                  <td>Terminaciones: llana / honda / centro / brazo / cámaras / registros / otros</td>
                  <td>{resumen.terminacionesElectricaPorCaja.llana} / {resumen.terminacionesElectricaPorCaja.honda} / {resumen.terminacionesElectricaPorCaja.centro} / {resumen.terminacionesElectricaPorCaja.brazo} / {resumen.terminacionesElectricaPorCaja.camara} / {resumen.terminacionesElectricaPorCaja.registro} / {resumen.terminacionesElectricaPorCaja.otros}</td>
                </tr>
                <tr>
                  <td>B2 Terminaciones T. débiles</td>
                  <td>Terminaciones: llana / honda / centro / brazo / cámaras / registros / otros</td>
                  <td>{resumen.terminacionesDebilesPorCaja.llana} / {resumen.terminacionesDebilesPorCaja.honda} / {resumen.terminacionesDebilesPorCaja.centro} / {resumen.terminacionesDebilesPorCaja.brazo} / {resumen.terminacionesDebilesPorCaja.camara} / {resumen.terminacionesDebilesPorCaja.registro} / {resumen.terminacionesDebilesPorCaja.otros}</td>
                </tr>
                <tr>
                  <td>A3 Puesta a tierra</td>
                  <td>Ítems cargados / total</td>
                  <td>{data.puestaATierra.filter((item) => n(item.cantidad) !== 0).length} registros / {fmt(resumen ? sumRows(data.puestaATierra, "cantidad") : 0, 0)} unid</td>
                </tr>
                <tr>
                  <td>AB1 Bandejas</td>
                  <td>Metraje / tapas / accesorios</td>
                  <td>{fmt(resumen.bandejasMetros)} m / {fmt(resumen.bandejasTapas)} m / {fmt(resumen.bandejasAccesorios, 0)} unid</td>
                </tr>
                <tr>
                  <td>AB2 Ductos</td>
                  <td>Metros / quiebres</td>
                  <td>{fmt(resumen.ductosMetros)} m / {fmt(resumen.ductosQuiebres, 0)} unid</td>
                </tr>
                <tr>
                  <td>Picadas</td>
                  <td>Yeso / mampostería / piso / zanja</td>
                  <td>{fmt3(resumen.picadasYeso)} / {fmt3(resumen.picadasMamposteria)} / {fmt3(resumen.picadaPiso)} / {fmt3(resumen.zanja)} m</td>
                </tr>
                <tr>
                  <td>C1 Tableros materiales</td>
                  <td>Materiales presupuestados / total</td>
                  <td>{data.materialesTableros.filter((item) => n(item.cantidad) !== 0 || n(item.precio_usd) !== 0).length} registros / USD {fmt(resumen.materialesTotal)}</td>
                </tr>
                <tr>
                  <td>E1 Luminarias</td>
                  <td>Tipos cargados / total</td>
                  <td>{data.luminarias.filter((item) => n(item.cantidad) !== 0).length} registros / {fmt(resumen.luminariasTotal, 0)} unid</td>
                </tr>
                <tr>
                  <td>Porteros</td>
                  <td>Ítems cargados / total</td>
                  <td>{data.porteros.length} registros / USD {fmt(resumen.porterosTotal)}</td>
                </tr>
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  );
}

export default ObraResumenPage;
