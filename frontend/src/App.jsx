import { useState, useEffect } from "react";
import DashboardLayout from "./layouts/DashboardLayout";
import HomePage from "./pages/HomePage";
import ObrasPage from "./pages/ObrasPage";
import ObraDetallePage from "./pages/ObraDetallePage";
import CrearObraPage from "./pages/CrearObraPage";

function App() {
  const [page, setPage] = useState("home");
  const [obraSeleccionada, setObraSeleccionada] = useState(null);
  const [obraEditando, setObraEditando] = useState(null);

  useEffect(() => {
    const handler = () => setPage("crear-obra");

    window.addEventListener("go-create-obra", handler);

    return () => {
      window.removeEventListener("go-create-obra", handler);
    };
  }, []);

  const irADetalleObra = (obra) => {
    setObraSeleccionada(obra);
    setPage("obra-detalle");
  };
  const irAEditarObra = (obra) => {
    setObraEditando(obra);
    setPage("editar-obra");
  };

  return (
    <DashboardLayout currentPage={page} onNavigate={setPage}>
      {page === "home" && (
        <HomePage
          onGoObras={() => setPage("obras")}
          onVerObra={irADetalleObra}
        />
      )}
      {page === "crear-obra" && (
        <CrearObraPage
          onBack={() => setPage("obras")}
          onVerObra={irADetalleObra}
        />
      )}

      {page === "obras" && (
        <ObrasPage
          onBack={() => setPage("home")}
          onVerObra={irADetalleObra}
          onEditarObra={irAEditarObra}
        />
      )}

      {page === "obra-detalle" && (
        <ObraDetallePage
          obra={obraSeleccionada}
          onBack={() => setPage("obras")}
        />
      )}
      {page === "editar-obra" && (
        <CrearObraPage
          modo="editar"
          obraInicial={obraEditando}
          onBack={() => setPage("obras")}
          onVerObra={irADetalleObra}
        />
      )}
    </DashboardLayout>
  );
}

export default App;
