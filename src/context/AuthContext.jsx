import React,{createContext,useCallback,useContext,useEffect,useMemo,useState} from 'react';
const AuthContext=createContext(null);
let tokenEnMemoria=null;
let renovacionEnCurso=null;
export function obtenerToken(){return tokenEnMemoria;}
function perfilNormalizado(u){return u?{...u,rol:u.rol==='ADMIN'?'Administrador':'Cliente'}:null;}
async function peticion(url,body){
 const res=await fetch(url,{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
 const data=await res.json().catch(()=>({}));
 if(!res.ok)throw Error(data?.detail||data?.message||data?.error||(`Error HTTP ${res.status}`));
 return data;
}
export function AuthProvider({children}){
 const [usuario,setUsuario]=useState(null);
 const [cargandoSesion,setCargandoSesion]=useState(true);
 useEffect(()=>{let vivo=true;fetch('/api/auth/refresh',{method:'POST',credentials:'same-origin'}).then(async r=>{if(!r.ok)throw Error('Sin sesión previa');return r.json()}).then(data=>{if(vivo){tokenEnMemoria=data.accessToken;setUsuario(perfilNormalizado(data.usuario));}}).catch(()=>{if(vivo){tokenEnMemoria=null;setUsuario(null);}}).finally(()=>{if(vivo)setCargandoSesion(false)});return()=>{vivo=false}},[]);
 async function registrar(data){const respuesta=await peticion('/api/auth/registro',data);tokenEnMemoria=respuesta.accessToken;setUsuario(perfilNormalizado(respuesta.usuario));return respuesta.usuario;}
 async function iniciarSesion(correo,password){const respuesta=await peticion('/api/auth/login',{correo,password});tokenEnMemoria=respuesta.accessToken;setUsuario(perfilNormalizado(respuesta.usuario));return respuesta.usuario;}
 async function cerrarSesion(){try{await fetch('/api/auth/logout',{method:'POST',credentials:'same-origin'});}finally{tokenEnMemoria=null;setUsuario(null);}}
 const peticionProtegida=useCallback(async (url, opciones={})=>{
  async function ejecutar(){
   const token=tokenEnMemoria;
   const res=await fetch(url,{...opciones,credentials:'same-origin',headers:{
    ...(opciones.body?{'Content-Type':'application/json'}:{}),
    ...opciones.headers,
    ...(token?{Authorization:`Bearer ${token}`}:{})
   }});
   return res;
  }
  let res=await ejecutar();
  if(res.status===401){
   // Solo se permite un refresh en vuelo: evita reutilizar un token rotado.
   if(!renovacionEnCurso){
    renovacionEnCurso=fetch('/api/auth/refresh',{method:'POST',credentials:'same-origin'})
     .then(async r=>{if(!r.ok)throw Error('Tu sesión ha expirado');return r.json()})
     .finally(()=>{renovacionEnCurso=null});
   }
   try{
    const data=await renovacionEnCurso;
    tokenEnMemoria=data.accessToken;
    setUsuario(perfilNormalizado(data.usuario));
    res=await ejecutar();
   }catch(err){tokenEnMemoria=null;setUsuario(null);throw err;}
  }
  const data=await res.json().catch(()=>null);
  if(!res.ok)throw Error(data?.detail||data?.message||data?.error||`Error HTTP ${res.status}`);
  return data;
 },[]);
 const value=useMemo(()=>({usuario,cargandoSesion,registrar,iniciarSesion,cerrarSesion,peticionProtegida}),[usuario,cargandoSesion,peticionProtegida]);
 return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth(){const v=useContext(AuthContext);if(!v)throw Error('Falta AuthProvider');return v;}
