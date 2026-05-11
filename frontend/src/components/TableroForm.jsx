function TableroForm({
  nombreTablero,
  setNombreTablero,

  alturaLocal,
  setAlturaLocal,

  alturaTablero,
  setAlturaTablero,

  agregadoTablero,
  setAgregadoTablero,

  alturaToma,
  setAlturaToma,

  alturaLlaveLuz,
  setAlturaLlaveLuz,

  alturaBrazo,
  setAlturaBrazo,

  alturaEspecial,
  setAlturaEspecial,

  agregadoCajaHonda,
  setAgregadoCajaHonda,

  agregadoCajaCentro,
  setAgregadoCajaCentro,

  agregadoCajaBrazo,
  setAgregadoCajaBrazo,

  agregadoHEspecial,
  setAgregadoHEspecial,

  tipoTableroId,
  setTipoTableroId,

  onCrear,
  onPrecargar,
}) {
  return (
    <form onSubmit={onCrear} className="tablero-form-wrapper">
      <div className="form-section-title">Crear Tablero</div>

      <div className="form-grid tablero-form-grid">
        <div className="form-field">
          <label>Nombre de Tablero</label>
          <input
            value={nombreTablero}
            onChange={(e) => setNombreTablero(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Altura de Local</label>
          <input
            type="number"
            step="0.01"
            value={alturaLocal}
            onChange={(e) => setAlturaLocal(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Altura de Tablero</label>
          <input
            type="number"
            step="0.01"
            value={alturaTablero}
            onChange={(e) => setAlturaTablero(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Agregado Tablero</label>
          <input
            type="number"
            step="0.01"
            value={agregadoTablero}
            onChange={(e) => setAgregadoTablero(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Altura Toma</label>
          <input
            type="number"
            step="0.01"
            value={alturaToma}
            onChange={(e) => setAlturaToma(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Altura Llave</label>
          <input
            type="number"
            step="0.01"
            value={alturaLlaveLuz}
            onChange={(e) => setAlturaLlaveLuz(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Altura Brazo</label>
          <input
            type="number"
            step="0.01"
            value={alturaBrazo}
            onChange={(e) => setAlturaBrazo(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Altura Especial</label>
          <input
            type="number"
            step="0.01"
            value={alturaEspecial}
            onChange={(e) => setAlturaEspecial(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Agregado Caja Honda</label>
          <input
            type="number"
            step="0.01"
            value={agregadoCajaHonda}
            onChange={(e) => setAgregadoCajaHonda(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Agregado Caja Centro</label>
          <input
            type="number"
            step="0.01"
            value={agregadoCajaCentro}
            onChange={(e) => setAgregadoCajaCentro(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Agregado Caja Brazo</label>
          <input
            type="number"
            step="0.01"
            value={agregadoCajaBrazo}
            onChange={(e) => setAgregadoCajaBrazo(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Agregado H Especial</label>
          <input
            type="number"
            step="0.01"
            value={agregadoHEspecial}
            onChange={(e) => setAgregadoHEspecial(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Tipo</label>
          <select
            value={tipoTableroId}
            onChange={(e) => setTipoTableroId(e.target.value)}
          >
            <option value={1}>Electrica</option>
            <option value={2}>Datos</option>
          </select>
        </div>

        <div className="button-row tablero-button-row">
          <button className="btn-primary" type="submit">
            Guardar
          </button>

          <button className="btn-secondary" type="button" onClick={onPrecargar}>
            Nuevo con datos anteriores
          </button>
        </div>
      </div>
    </form>
  );
}

export default TableroForm;
