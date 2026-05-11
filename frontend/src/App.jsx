import { useState } from "react";
import DashboardLayout from "./layouts/DashboardLayout";
import HomePage from "./pages/HomePage";
import ObrasPage from "./pages/ObrasPage";
import ObraDetallePage from "./pages/ObraDetallePage";

function App() {
  const [page, setPage] = useState("home");
  const [obraSeleccionada, setObraSeleccionada] = useState(null);

  const irADetalleObra = (obra) => {
    setObraSeleccionada(obra);
    setPage("obra-detalle");
  };

  return (
    <DashboardLayout currentPage={page} onNavigate={setPage}>
      {page === "home" && (
        <HomePage
          onGoObras={() => setPage("obras")}
          onVerObra={irADetalleObra}
        />
      )}

      {page === "obras" && (
        <ObrasPage onBack={() => setPage("home")} onVerObra={irADetalleObra} />
      )}

      {page === "obra-detalle" && (
        <ObraDetallePage
          obra={obraSeleccionada}
          onBack={() => setPage("obras")}
        />
      )}
    </DashboardLayout>
  );
}

export default App;
