import React,{useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext.jsx';
export function Registro(){
  const {usuario,registrar}=useAuth();const nav=useNavigate();
  const [data,setData]=useState({nombre:'',apellidos:'',correo:'',password:'',confirmar:''});const [mensaje,setMensaje]=useState('');const [ocupado,setOcupado]=useState(false);
  async function enviar(e){e.preventDefault();setMensaje('');if(data.password!==data.confirmar){setMensaje('Las contraseñas no coinciden.');return;}setOcupado(true);try{await registrar(data);nav('/');}catch(err){setMensaje(err.message);}finally{setOcupado(false)}}
  if(usuario)return <main className="container py-5" style={{maxWidth:600}}><h1>Ya tienes una sesión abierta</h1><Link to="/">Volver al inicio</Link></main>;
  const labels={nombre:'Nombre',apellidos:'Apellidos',correo:'Correo electrónico',password:'Contraseña',confirmar:'Confirmar contraseña'};
  return <main className="container py-5" style={{maxWidth:600}}><h1>Registrarse</h1><p className="text-muted">Cuenta local para la evaluación. No utilices contraseñas personales reales.</p><form onSubmit={enviar}>{Object.keys(data).map(k=><div className="mb-3" key={k}><label htmlFor={'registro-'+k} className="form-label">{labels[k]}</label><input id={'registro-'+k} required minLength={k==='password'?8:undefined} className="form-control" autoComplete={k==='correo'?'email':k==='password'?'new-password':undefined} type={k==='correo'?'email':['password','confirmar'].includes(k)?'password':'text'} value={data[k]} onChange={e=>setData({...data,[k]:e.target.value})}/></div>)}<button className="btn btn-success" disabled={ocupado}>{ocupado?'Registrando…':'Registrarse'}</button></form>{mensaje&&<p role="alert" className="mt-3 text-danger">{mensaje}</p>}<p className="mt-3"><Link to="/login">¿Ya tienes cuenta? Inicia sesión</Link></p></main>;
}
