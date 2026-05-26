import { useState } from "react";
import AutoSaveStatus from "../components/AutoSaveStatus";
import CircuitoForm from "../components/CircuitoForm";
import CircuitosGrid from "../components/CircuitosGrid";
import CircuitosTotalesBar from "../components/CircuitosTotalesBar";
import { useCircuitos } from "../hooks/useCircuitos";

function CircuitosPage({ tablero, tipo, onBack }) {
  const { circuitos, totales, agregarCircuito, editarCircuito, eliminarCircuito, duplicarCircuito, loading, error, saveStatus } = useCircuitos(tablero?.id, tipo);
  const [editingCircuito, setEditingCircuito] = useState(null);

  const guardarCircuito = async (circuito) => {
    if (editingCircuito?.id) {
      await editarCircuito(editingCircuito.id, circuito);
      setEditingCircuito(null);
      return;
    }
    await agregarCircuito(circuito);
  };

  return (
    <div className="vatio-module">
      <div className="vatio-module-head">
        <div>
          <p className="eyebrow">{tipo === "debiles" ? "B1" : "A1"}</p>
          <h3>Circuitos {tipo === "debiles" ? "T. Débiles" : "Eléctrica"} — {tablero?.nombre}</h3>
          <p>Entrada de circuitos por tablero. Caño losa, caño pared y cable se calculan como en Excel.</p>
        </div>
        <div className="module-actions">
          <AutoSaveStatus {...saveStatus} />
          <button className="btn-secondary" onClick={onBack}>← Volver</button>
        </div>
      </div>
      {error && <p className="vatio-alert">{error}</p>}
      {loading && <p>Cargando...</p>}
      <CircuitoForm
        tipo={tipo}
        tablero={tablero}
        onSubmit={guardarCircuito}
        editingCircuito={editingCircuito}
        onCancelEdit={() => setEditingCircuito(null)}
      />
      <CircuitosTotalesBar totales={totales} />
      <CircuitosGrid
        circuitos={circuitos}
        onDelete={eliminarCircuito}
        onDuplicar={duplicarCircuito}
        onEditar={setEditingCircuito}
      />
    </div>
  );
}

export default CircuitosPage;
