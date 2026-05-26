import { useMemo, useState } from "react";

const buildSections = (items = []) => {
  const sections = [];
  let current = null;

  items.forEach((item) => {
    if (item.titulo) {
      current = { titulo: item.titulo, items: [] };
      sections.push(current);
      return;
    }

    if (!current) {
      current = { titulo: item.tipo_caja || "Terminaciones", items: [] };
      sections.push(current);
    }
    current.items.push(item);
  });

  return sections.filter((section) => section.items.length > 0);
};

const materialesDeSeccion = (section) => {
  const usaSoloGeneral = section.items.every((item) => Array.isArray(item.materiales) && item.materiales.length === 1 && item.materiales[0] === "GENERAL");
  return usaSoloGeneral ? ["GENERAL"] : ["PLASTICO", "METAL"];
};

const etiquetaMaterial = (material) => {
  if (material === "PLASTICO") return "Plástico";
  if (material === "METAL") return "Metal";
  return "Cantidad";
};

const buildClosedState = (sections) => Object.fromEntries(sections.map((section) => [section.titulo, false]));
const buildOpenState = (sections) => Object.fromEntries(sections.map((section) => [section.titulo, true]));

function TerminacionesGrid({
  tableros,
  items,
  valor,
  actualizarCantidad,
  agregarItemCatalogo,
  editarItemCatalogo,
}) {
  const sections = useMemo(() => buildSections(items), [items]);
  const [openSections, setOpenSections] = useState(() => buildClosedState(sections));
  const [newItems, setNewItems] = useState({});
  const [savingSection, setSavingSection] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [catalogActionId, setCatalogActionId] = useState(null);

  const anyOpen = sections.some((section) => openSections[section.titulo]);

  const toggleSection = (titulo) => {
    setOpenSections((current) => ({
      ...current,
      [titulo]: !current[titulo],
    }));
  };

  const expandAll = () => setOpenSections(buildOpenState(sections));
  const collapseAll = () => setOpenSections(buildClosedState(sections));

  const updateNewItem = (titulo, value) => {
    setNewItems((current) => ({ ...current, [titulo]: value }));
  };

  const addCustomItem = async (section, materiales) => {
    const item = String(newItems[section.titulo] || "").trim();
    if (!item || !agregarItemCatalogo) return;

    const tipoCaja = section.items[0]?.tipo_caja || section.titulo;
    setSavingSection(section.titulo);
    try {
      await agregarItemCatalogo({
        grupo: section.titulo,
        tipo_caja: tipoCaja,
        item,
        materiales: materiales.length === 1 && materiales[0] === "GENERAL" ? ["GENERAL"] : null,
      });
      updateNewItem(section.titulo, "");
      setOpenSections((current) => ({ ...current, [section.titulo]: true }));
    } finally {
      setSavingSection("");
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditingValue(item.item || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingValue("");
  };

  const saveEdit = async (item, section) => {
    const nuevoTexto = String(editingValue || "").trim();
    if (!nuevoTexto || !editarItemCatalogo || !item.id) return;
    setCatalogActionId(item.id);
    try {
      await editarItemCatalogo({
        id: item.id,
        item: nuevoTexto,
        grupo: section.titulo,
        tipo_caja: item.tipo_caja,
      });
      cancelEdit();
    } finally {
      setCatalogActionId(null);
    }
  };



  if (sections.length === 0) {
    return <p className="vatio-muted">No hay ítems de terminaciones configurados.</p>;
  }

  return (
    <div className="terminaciones-sections">
      <div className="terminaciones-actions">
        <button type="button" className="btn-secondary btn-small" onClick={expandAll}>Desplegar todos</button>
        <button type="button" className="btn-secondary btn-small" onClick={collapseAll} disabled={!anyOpen}>Contraer todos</button>
      </div>

      {sections.map((section) => {
        const materiales = materialesDeSeccion(section);
        const sectionTotal = section.items.reduce((acc, item) => (
          acc + tableros.reduce((sum, tablero) => (
            sum + materiales.reduce((s, material) => s + valor(item.item, tablero.id, material), 0)
          ), 0)
        ), 0);
        const open = Boolean(openSections[section.titulo]);
        const newItemValue = newItems[section.titulo] || "";
        const saving = savingSection === section.titulo;

        return (
          <div className={`terminaciones-section-card ${open ? "is-open" : ""}`} key={section.titulo}>
            <button
              type="button"
              className="terminaciones-section-header"
              onClick={() => toggleSection(section.titulo)}
            >
              <span className={`collapse-icon ${open ? "open" : ""}`}>⌄</span>
              <span className="terminaciones-section-title">{section.titulo}</span>
              <span className="terminaciones-section-meta">{section.items.length} ítems</span>
              <strong className="terminaciones-section-total">{sectionTotal}</strong>
            </button>

            {open && (
              <div className="terminaciones-section-body">
                <div className="terminaciones-add-row">
                  <div>
                    <strong>Agregar descripción personalizada</strong>
                    <p>Quedará disponible en este módulo para futuras obras.</p>
                  </div>
                  <input
                    type="text"
                    value={newItemValue}
                    placeholder={`Nueva descripción para ${section.titulo.toLowerCase()}`}
                    onChange={(e) => updateNewItem(section.titulo, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomItem(section, materiales);
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn-primary btn-small"
                    onClick={() => addCustomItem(section, materiales)}
                    disabled={!newItemValue.trim() || saving}
                  >
                    {saving ? "Guardando..." : "+ Agregar"}
                  </button>
                </div>

                <div className="vatio-table-wrap terminaciones-section-table">
                  <table className="vatio-table terminaciones-table">
                    <colgroup>
                      <col className="term-col-tipo" />
                      <col className="term-col-item" />
                      {tableros.flatMap((tablero) => materiales.map((material) => (
                        <col className="term-col-value" key={`col-${section.titulo}-${tablero.id}-${material}`} />
                      )))}
                      <col className="term-col-total" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>Tipo caja</th>
                        <th>Ítem</th>
                        {tableros.flatMap((tablero) => materiales.map((material) => (
                          <th key={`${section.titulo}-${tablero.id}-${material}`}>{tablero.nombre} {etiquetaMaterial(material)}</th>
                        )))}
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.items.map((item) => {
                        const total = tableros.reduce((sum, tablero) => (
                          sum + materiales.reduce((s, material) => s + valor(item.item, tablero.id, material), 0)
                        ), 0);
                        const isEditing = item.personalizado && editingId === item.id;
                        const actionBusy = catalogActionId === item.id;

                        return (
                          <tr key={`${section.titulo}-${item.tipo_caja}-${item.id || item.item}`} className={item.personalizado ? "custom-catalog-row" : ""}>
                            <td>{item.tipo_caja}</td>
                            <td>
                              {isEditing ? (
                                <div className="catalog-inline-edit">
                                  <input
                                    className="catalog-edit-input"
                                    type="text"
                                    value={editingValue}
                                    onChange={(e) => setEditingValue(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        saveEdit(item, section);
                                      }
                                      if (e.key === "Escape") cancelEdit();
                                    }}
                                    autoFocus
                                  />
                                  <button type="button" className="btn-primary btn-small" onClick={() => saveEdit(item, section)} disabled={!editingValue.trim() || actionBusy}>Guardar</button>
                                  <button type="button" className="btn-secondary btn-small" onClick={cancelEdit} disabled={actionBusy}>Cancelar</button>
                                </div>
                              ) : (
                                <div className="catalog-item-cell">
                                  <span>{item.item}</span>
                                  {item.personalizado && <span className="custom-catalog-badge">personalizado</span>}
                                  {item.eliminado && <span className="custom-catalog-badge muted">histórico</span>}
                                  {item.personalizado && !item.eliminado && (
                                    <button type="button" className="catalog-inline-edit-btn" onClick={() => startEdit(item)} disabled={actionBusy}>Editar</button>
                                  )}
                                </div>
                              )}
                            </td>
                            {tableros.flatMap((tablero) => materiales.map((material) => (
                              <td key={`${item.item}-${tablero.id}-${material}`}>
                                <input
                                  type="number"
                                  min="0"
                                  value={valor(item.item, tablero.id, material)}
                                  onChange={(e) => actualizarCantidad(item.item, item.tipo_caja, tablero.id, material, e.target.value)}
                                />
                              </td>
                            )))}
                            <td className="table-total-cell">{total}</td>

                          </tr>
                        );
                      })}
                      <tr className="table-total-row">
                        <td colSpan={2 + tableros.length * materiales.length}>Total {section.titulo}</td>
                        <td>{sectionTotal}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default TerminacionesGrid;
