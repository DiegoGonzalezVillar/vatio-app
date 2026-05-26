import { formatDecimal } from "../utils/format";

const n = (v, digits = 2) => formatDecimal(v, digits);

function CircuitosTotalesBar({ totales }) {
  const cards = [
    ["CP", totales.cp], ["CH", totales.ch], ["CLL", totales.cll], ["CC", totales.cc], ["CB", totales.cb],
    ["Bajadas tomas", totales.bajadas_tomas], ["Bajadas luces", totales.bajadas_luces], ["Cable m", totales.cable_metros, 3], ["Bandeja m", totales.bandeja_metros, 3], ["Picada yeso m", totales.picada_yeso_m, 3], ["Picada mamp. m", totales.picada_mamposteria_m, 3],
  ];
  return <div className="vatio-kpi-row">{cards.map(([label, value, digits]) => <div className="vatio-kpi" key={label}><span>{label}</span><strong>{n(value, digits ?? 2)}</strong></div>)}</div>;
}
export default CircuitosTotalesBar;
