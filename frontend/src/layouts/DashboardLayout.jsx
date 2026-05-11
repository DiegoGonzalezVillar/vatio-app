function DashboardLayout({ children, currentPage, onNavigate }) {
  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark">⚡</div>
          <div>
            <h1>Vatio</h1>
            <span>Metrado eléctrico</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={currentPage === "home" ? "active" : ""}
            onClick={() => onNavigate("home")}
          >
            <span>⌂</span> Inicio
          </button>

          <button
            className={currentPage === "obras" ? "active" : ""}
            onClick={() => onNavigate("obras")}
          >
            <span>▦</span> Obras
          </button>

          <button>
            <span>□</span> Insumos
          </button>

          <button>
            <span>▤</span> Reportes
          </button>

          <button>
            <span>⚙</span> Configuración
          </button>
        </nav>

        <div className="sidebar-footer">
          <span>Sistema</span>
          <strong>v1.0 MVP</strong>
        </div>
      </aside>

      <section className="dashboard-main">
        <header className="topbar">
          <div>
            <p className="topbar-eyebrow">Panel operativo</p>
            <h2>Sistema de metrado y conteo</h2>
          </div>

          <div className="topbar-actions">
            <div className="search-box">Buscar...</div>
            <div className="user-chip">DG</div>
          </div>
        </header>

        <main className="dashboard-content">{children}</main>
      </section>
    </div>
  );
}

export default DashboardLayout;
