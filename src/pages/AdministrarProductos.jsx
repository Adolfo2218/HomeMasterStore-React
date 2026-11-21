import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {useAuth} from '../context/AuthContext.jsx';
import {useProductos} from '../context/ProductosContext.jsx';

const nuevoProducto = {nombre: '', precio: '', imagen: '', categoria: 'Semillas', etiqueta: ''};
const categorias = ['Semillas', 'Packs', 'Otros', 'Ofertas'];

export default function AdministrarProductos() {
  const {peticionProtegida} = useAuth();
  const {productos, cargando, error: errorCatalogo, recargar} = useProductos();
  const [form, setForm] = useState(nuevoProducto);
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => { recargar(); }, [recargar]);

  function limpiar() {
    setForm(nuevoProducto);
    setEditandoId(null);
    setError('');
  }
  function editar(producto) {
    setForm({
      nombre: producto.nombre ?? '',
      precio: String(producto.precio ?? ''),
      imagen: producto.imagen ?? '',
      categoria: producto.categoria ?? 'Semillas',
      etiqueta: producto.etiqueta ?? ''
    });
    setEditandoId(producto.id);
    setMensaje('');
    setError('');
    window.scrollTo({top: 0, behavior: 'smooth'});
  }
  async function guardar(evento) {
    evento.preventDefault();
    setError(''); setMensaje('');
    const precio = Number(form.precio);
    if (!Number.isFinite(precio) || precio < 0 || String(form.precio).trim() === '') {
      setError('Ingresa un precio válido, igual o superior a cero.'); return;
    }
    const cuerpo = {
      nombre: form.nombre.trim(),
      precio,
      imagen: form.imagen.trim().replace(/^\//, ''),
      categoria: form.categoria.trim(),
      etiqueta: form.etiqueta.trim()
    };
    if (!cuerpo.nombre || !cuerpo.imagen || !cuerpo.categoria) {
      setError('Completa nombre, imagen y categoría.'); return;
    }
    setProcesando(true);
    try {
      const esEdicion = editandoId !== null;
      await peticionProtegida(esEdicion ? `/api/productos/${editandoId}` : '/api/productos', {
        method: esEdicion ? 'PUT' : 'POST', body: JSON.stringify(cuerpo)
      });
      limpiar();
      recargar();
      setMensaje(esEdicion ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.');
    } catch (err) { setError(err.message || 'No fue posible guardar el producto.'); }
    finally { setProcesando(false); }
  }
  async function eliminar(producto) {
    if (!window.confirm(`¿Eliminar definitivamente "${producto.nombre}"? Esta acción no se puede deshacer.`)) return;
    setProcesando(true); setMensaje(''); setError('');
    try {
      await peticionProtegida(`/api/productos/${producto.id}`, {method: 'DELETE'});
      if (editandoId === producto.id) limpiar();
      recargar();
      setMensaje('Producto eliminado correctamente.');
    } catch (err) { setError(err.message || 'No fue posible eliminar el producto.'); }
    finally { setProcesando(false); }
  }

  const visibles = productos.filter(p =>
    `${p.id} ${p.nombre} ${p.categoria}`.toLowerCase().includes(busqueda.toLowerCase())
  );
  return <main className="container py-5">
    <h1>Administración de productos</h1>
    <p className="text-muted">Los cambios se guardan en Spring Boot y H2, y se reflejan en el catálogo de la tienda.</p>
    <p><Link to="/usuarios">Administrar usuarios</Link>{' · '}<Link to="/productos">Ver catálogo público</Link></p>
    {mensaje && <div className="alert alert-success" role="status">{mensaje}</div>}
    {error && <div className="alert alert-danger" role="alert">{error}</div>}
    <section className="card mb-4"><div className="card-body">
      <h2 className="h4">{editandoId !== null ? `Editar producto #${editandoId}` : 'Crear producto'}</h2>
      <form className="row g-3" onSubmit={guardar}>
        <div className="col-md-8"><label htmlFor="prod-nombre" className="form-label">Nombre</label><input id="prod-nombre" className="form-control" required maxLength="255" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})}/></div>
        <div className="col-md-4"><label htmlFor="prod-precio" className="form-label">Precio</label><input id="prod-precio" className="form-control" type="number" min="0" step="0.01" required value={form.precio} onChange={e => setForm({...form, precio: e.target.value})}/></div>
        <div className="col-md-6"><label htmlFor="prod-imagen" className="form-label">Ruta de imagen</label><input id="prod-imagen" className="form-control" required placeholder="img/1.jpg" value={form.imagen} onChange={e => setForm({...form, imagen: e.target.value})}/><div className="form-text">Usa una imagen existente en la carpeta public del frontend. No sube archivos.</div></div>
        <div className="col-md-3"><label htmlFor="prod-categoria" className="form-label">Categoría</label><select id="prod-categoria" className="form-select" value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})}>{categorias.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
        <div className="col-md-3"><label htmlFor="prod-etiqueta" className="form-label">Etiqueta</label><input id="prod-etiqueta" className="form-control" placeholder="Nuevo / Oferta" value={form.etiqueta} onChange={e => setForm({...form, etiqueta: e.target.value})}/></div>
        <div className="col-12"><button className="btn btn-success" disabled={procesando}>{procesando ? 'Procesando...' : editandoId !== null ? 'Guardar cambios' : 'Crear producto'}</button>{' '}{editandoId !== null && <button type="button" className="btn btn-outline-secondary" disabled={procesando} onClick={limpiar}>Cancelar edición</button>}</div>
      </form>
    </div></section>
    <section aria-label="Listado de productos">
      <div className="d-flex flex-wrap gap-3 justify-content-between align-items-center mb-3"><h2 className="h4 mb-0">Productos registrados ({productos.length})</h2><input className="form-control" style={{maxWidth: 320}} placeholder="Buscar producto o categoría" aria-label="Buscar productos" value={busqueda} onChange={e => setBusqueda(e.target.value)}/></div>
      {cargando ? <p role="status">Cargando productos...</p> : errorCatalogo ? <div className="alert alert-warning" role="alert">{errorCatalogo} <button type="button" className="btn btn-outline-secondary btn-sm" onClick={recargar}>Reintentar</button></div> :
      <div className="table-responsive"><table className="table table-striped align-middle"><thead><tr><th>ID</th><th>Imagen</th><th>Nombre</th><th>Precio</th><th>Categoría</th><th>Etiqueta</th><th>Acciones</th></tr></thead><tbody>
        {visibles.map(p => <tr key={p.id}><td>{p.id}</td><td><img src={'/' + String(p.imagen || '').replace(/^\//, '')} alt="" width="58" height="58" style={{objectFit: 'cover'}}/></td><td>{p.nombre}</td><td>{Number(p.precio).toFixed(2)}</td><td>{p.categoria}</td><td>{p.etiqueta || '—'}</td><td><div className="d-flex flex-wrap gap-2"><button type="button" className="btn btn-sm btn-outline-primary" disabled={procesando} onClick={() => editar(p)}>Editar</button><button type="button" className="btn btn-sm btn-outline-danger" disabled={procesando} onClick={() => eliminar(p)}>Eliminar</button></div></td></tr>)}
        {visibles.length === 0 && <tr><td colSpan="7">No se encontraron productos.</td></tr>}
      </tbody></table></div>}
    </section>
  </main>;
}
