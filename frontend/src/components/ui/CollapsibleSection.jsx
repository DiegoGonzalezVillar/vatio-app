import { useState } from "react";

function CollapsibleSection({
  title,
  eyebrow,
  defaultOpen = true,
  rightContent,
  children,
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="collapsible-section">
      <button
        type="button"
        className="collapsible-header"
        onClick={() => setOpen(!open)}
      >
        <div>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2>{title}</h2>
        </div>

        <div className="collapsible-header-right">
          {rightContent}
          <span className={`collapse-icon ${open ? "open" : ""}`}>⌄</span>
        </div>
      </button>

      {open && <div className="collapsible-content">{children}</div>}
    </section>
  );
}

export default CollapsibleSection;
