import { calcularPicadasTerminaciones } from "../utils/calculosTerminaciones";
function PicadasResumen({ totalesCircuitos }) {
  const p = calcularPicadasTerminaciones(totalesCircuitos);
  return <div className="vatio-kpi-row"><div className="vatio-kpi"><span>Interruptores</span><strong>{p.metros_interruptores.toFixed(2)} m</strong></div><div className="vatio-kpi"><span>Tomas</span><strong>{p.metros_tomas.toFixed(2)} m</strong></div><div className="vatio-kpi"><span>Total bajadas</span><strong>{p.total_metros.toFixed(2)} m</strong></div><div className="vatio-kpi"><span>Reales metrado</span><strong>{p.reales_metrado.toFixed(2)}</strong></div></div>;
}
export default PicadasResumen;
