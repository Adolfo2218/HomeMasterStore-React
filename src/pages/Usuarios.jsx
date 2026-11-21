import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function Usuarios() {
  const { peticionProtegida, usuario } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('');
  const [procesando, setProcesando] = useState(null);
  const cargar = useCallback(async () => {
    setError(''); setCargando(true);
    try { setUsuarios(await peticionProtegida('/api/usuarios')); }
    catch (err) { setError(err.message); }
    finally { setCargando(false); }
  }, [peticionProtegida]);
  useEffect(() => { cargar(); }, [cargar]);

  async function cambiarEstado(u) {
    const accion = u.habilitado ? 'deshabilitar' : 'habilitar';
    if (!window.confirm(`¿Quieres ${accion} la cuenta de ${u.correo}?`)) return;
    setProcesando(u.id); setError('');
    try {
      const actualizado = await peticionProtegida(`/api/usuarios/${u.id}/estado`, {
        method: 'PATCH', body: JSON.stringify({ habilitado: !u.habilitado })
      });
      setUsuarios(anterior => anterior.map(x => x.id === u.id ? actualizado : x));
    } catch (err) { setError(err.message); }
    finally { setProcesando(null); }
  }

  const visibles = usuarios.filter(u =>
    (!filtro || u.rol === filtro) &&
    `${u.nombre} ${u.apellidos} ${u.correo}`.toLowerCase().includes(busqueda.toLowerCase())
  );
  return <main className="container py-5">
    <h1>Administración de usuarios</h1>
    <p><Link to="/admin/productos" className="btn btn-outline-primary">Administrar productos</Link></p>
    <p className="text-muted">Usuarios registrados en Spring Boot y H2. Deshabilitar una cuenta evita que vuelva a autenticarse sin borrar su historial.</p>
    <p><Link to="/nuevou" className="btn btn-success">Crear usuario</Link>{' '}<Link to="/">Volver a la tienda</Link></p>
    {error && <div className="alert alert-danger" role="alert">{error}</div>}
    <div className="row mb-3 g-2">
      <div className="col-md-6"><input className="form-control" value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar nombre o correo" aria-label="Buscar usuarios" /></div>
      <div className="col-md-3"><select className="form-select" value={filtro} onChange={e => setFiltro(e.target.value)} aria-label="Filtrar por rol"><option value="">Todos los roles</option><option value="ADMIN">Administrador</option><option value="CLIENTE">Cliente</option></select></div>
    </div>
    {cargando ? <p role="status">Cargando usuarios...</p> : <div className="table-responsive"><table className="table table-striped"><thead><tr><th>ID</th><th>Nombre</th><th>Correo</th><th>Rol</th><th>Estado</th><th>Acción</th></tr></thead><tbody>
      {visibles.map(u => <tr key={u.id}><td>{u.id}</td><td>{u.nombre} {u.apellidos}</td><td>{u.correo}</td><td>{u.rol === 'ADMIN' ? 'Administrador' : 'Cliente'}</td><td>{u.habilitado ? 'Activo' : 'Deshabilitado'}</td><td><button type="button" className={`btn btn-sm ${u.habilitado ? 'btn-outline-danger' : 'btn-outline-success'}`} disabled={procesando === u.id || (usuario?.id === u.id && u.habilitado)} onClick={() => cambiarEstado(u)}>{u.habilitado ? 'Deshabilitar' : 'Habilitar'}</button></td></tr>)}
      {visibles.length === 0 && <tr><td colSpan="6">No hay usuarios para mostrar.</td></tr>}
    </tbody></table></div>}
  </main>;
}

export function NuevoUsuario() {
  const { peticionProtegida } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ nombre: '', apellidos: '', correo: '', password: '', rol: 'CLIENTE' });
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);
  async function enviar(e) {
    e.preventDefault(); setError(''); setGuardando(true);
    try { await peticionProtegida('/api/usuarios', { method: 'POST', body: JSON.stringify(form) }); nav('/usuarios'); }
    catch (err) { setError(err.message); }
    finally { setGuardando(false); }
  }
  return <main className="container py-5" style={{ maxWidth: 760 }}><h1>Nuevo usuario</h1><p className="text-muted">La cuenta se guardará en H2 con su contraseña protegida mediante BCrypt.</p>
    <form className="row g-3" onSubmit={enviar}>
      {['nombre','apellidos','correo','password'].map(k => <div className="col-md-6" key={k}><label className="form-label text-capitalize" htmlFor={`nuevo-${k}`}>{k === 'password' ? 'Contraseña temporal' : k}</label><input id={`nuevo-${k}`} className="form-control" required minLength={k === 'password' ? 12 : undefined} maxLength={k === 'password' ? 128 : undefined} type={k === 'correo' ? 'email' : k === 'password' ? 'password' : 'text'} value={form[k]} autoComplete="off" onChange={e => setForm({...form, [k]: e.target.value})}/></div>)}
      <div className="col-md-6"><label className="form-label" htmlFor="nuevo-rol">Rol</label><select id="nuevo-rol" className="form-select" value={form.rol} onChange={e => setForm({...form, rol: e.target.value})}><option value="CLIENTE">Cliente</option><option value="ADMIN">Administrador</option></select></div>
      {error && <p className="text-danger" role="alert">{error}</p>}
      <div><button className="btn btn-success" disabled={guardando}>{guardando ? 'Guardando...' : 'Guardar usuario'}</button>{' '}<Link to="/usuarios">Cancelar</Link></div>
    </form>
  </main>;
}
