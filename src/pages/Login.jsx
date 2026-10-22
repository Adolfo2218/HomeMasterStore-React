import React,{useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext.jsx';
export function Login(){
  const {usuario,iniciarSesion} = useAuth(); const nav=useNavigate();
  const [correo,setCorreo]=useState('');const [password,setPassword]=useState('');
  const [mensaje,setMensaje]=useState('');const [ocupado,setOcupado]=useState(false);
  async function enviar(e){e.preventDefault();setMensaje('');setOcupado(true);try{await iniciarSesion(correo,password);nav('/');}catch(err){setMensaje(err.message);}finally{setOcupado(false)}}
  if(usuario)return <main className="container py-5" style={{maxWidth:600}}><h1>Sesión iniciada</h1><p>Ya ingresaste como {usuario.nombre} ({usuario.correo}).</p><Link to="/">Volver a la tienda</Link></main>;
  return <main className="container py-5" style={{maxWidth:600}}><h1>Iniciar sesión</h1><p className="text-muted">Acceso de demostración local. Usa una cuenta creada desde Registro.</p><div className="alert alert-info">Acceso administrativo de demostración: <strong>admin@homemaster.demo</strong> / <strong>AdminDemo2026!</strong>. Solo para la evaluación; no utilices datos reales.</div><form onSubmit={enviar}><label className="form-label" htmlFor="login-correo">Correo</label><input id="login-correo" className="form-control mb-3" type="email" autoComplete="email" value={correo} onChange={e=>setCorreo(e.target.value)} required/><label className="form-label" htmlFor="login-password">Contraseña</label><input id="login-password" className="form-control mb-3" type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} required/><button className="btn btn-success" disabled={ocupado}>{ocupado?'Ingresando…':'Ingresar'}</button></form>{mensaje&&<p role="alert" className="mt-3 text-danger">{mensaje}</p>}<p className="mt-3"><Link to="/registrar">¿No tienes cuenta? Regístrate</Link></p></main>;
}
