/** API simulada y aislada: ninguna prueba envía solicitudes a Spring Boot. */
import {productos as datosProductos} from '../data/productos.js';
export const adminApi = {id:1,nombre:'Administrador',apellidos:'Demo',correo:'admin@homemaster.demo',rol:'ADMIN',habilitado:true};
export const clienteApi = {id:2,nombre:'Ana',apellidos:'Test',correo:'ana@test.cl',rol:'CLIENTE',habilitado:true};
const cuenta=(u,password)=>({...u,password});
const clon=x=>JSON.parse(JSON.stringify(x));
const json=(data,status=200)=>({ok:status>=200&&status<300,status, json:async()=>clon(data), headers:{get:()=> 'application/json'}});
export const apiMock={
 cuentas:[],productos:[],activo:null,llamadas:[],errores:{},
 reset(){this.cuentas=[cuenta(adminApi,'AdminDemo2026!'),cuenta(clienteApi,'Prueba1234')];this.productos=clon(datosProductos);this.activo=null;this.llamadas=[];this.errores={};window.fetch=(url,opt={})=>this.responder(url,opt);},
 sesion(u=adminApi){this.activo=u;},
 sinSesion(){this.activo=null;},
 async responder(url,opt={}){
  const path=new URL(String(url),location.origin).pathname;
  const method=(opt.method||'GET').toUpperCase();
  this.llamadas.push({path,method,body:opt.body});
  const key=`${method} ${path}`;
  if(this.errores[key])return json({error:this.errores[key].mensaje||'Error simulado'},this.errores[key].codigo||400);
  let data={};try{data=opt.body?JSON.parse(opt.body):{}}catch{}
  if(path==='/api/auth/refresh'&&method==='POST')return this.activo?json({accessToken:'token-prueba',usuario:this.activo}):json({error:'Unauthorized'},401);
  if(path==='/api/auth/logout'&&method==='POST'){this.activo=null;return json({mensaje:'Sesión cerrada'})}
  if(path==='/api/auth/login'&&method==='POST'){
   const usuario=this.cuentas.find(x=>x.correo===String(data.correo||'').trim().toLowerCase()&&x.password===data.password&&x.habilitado);
   if(!usuario)return json({error:'Credenciales incorrectas'},401);
   this.activo=usuario;return json({accessToken:'token-prueba',usuario});
  }
  if(path==='/api/auth/registro'&&method==='POST'){
   if(!data.nombre?.trim()||!data.apellidos?.trim()||!data.correo?.trim()||!data.password)return json({error:'Completa todos los campos'},400);
   if(data.password.length<8)return json({error:'La contraseña debe tener al menos 8 caracteres'},400);
   const correo=data.correo.trim().toLowerCase();
   if(correo==='admin@homemaster.demo')return json({error:'Correo reservado'},409);
   if(this.cuentas.some(x=>x.correo===correo))return json({error:'Correo ya registrado'},409);
   const u={id:this.cuentas.length+1,nombre:data.nombre,apellidos:data.apellidos,correo,rol:'CLIENTE',habilitado:true};
   this.cuentas.push(cuenta(u,data.password));this.activo=u;return json({accessToken:'token-prueba',usuario:u},201);
  }
  if(path==='/api/productos'&&method==='GET')return json(this.productos);
  if(path.startsWith('/api/usuarios')){
   if(!this.activo||this.activo.rol!=='ADMIN')return json({error:'Forbidden'},403);
   if(path==='/api/usuarios'&&method==='GET')return json(this.cuentas.map(({password,...u})=>u));
   if(path==='/api/usuarios'&&method==='POST'){
    if(!data.nombre||!data.apellidos||!data.correo||!data.password)return json({error:'Completa todos los campos'},400);
    if(this.cuentas.some(x=>x.correo===data.correo))return json({error:'Correo ya registrado'},409);
    const u={id:Math.max(0,...this.cuentas.map(x=>x.id))+1,nombre:data.nombre,apellidos:data.apellidos,correo:data.correo,rol:data.rol,habilitado:true};
    this.cuentas.push(cuenta(u,data.password));return json(u,201);
   }
   const m=path.match(/^\/api\/usuarios\/(\d+)\/estado$/);
   if(m&&method==='PATCH'){
    const u=this.cuentas.find(x=>x.id===Number(m[1]));if(!u)return json({error:'No encontrado'},404);
    if(u.id===this.activo.id&&data.habilitado===false)return json({error:'No puedes deshabilitar tu cuenta'},400);
    u.habilitado=data.habilitado;const {password,...out}=u;return json(out);
   }
  }
  if(path.startsWith('/api/productos')&&['POST','PUT','DELETE'].includes(method)){
   if(!this.activo||this.activo.rol!=='ADMIN')return json({error:'Forbidden'},403);
   if(path==='/api/productos'&&method==='POST'){
    const producto={...data,id:Math.max(0,...this.productos.map(p=>p.id))+1};this.productos.push(producto);return json(producto,201);
   }
   const m=path.match(/^\/api\/productos\/(\d+)$/);if(m){const id=Number(m[1]);const i=this.productos.findIndex(x=>x.id===id);if(i<0)return json({error:'No encontrado'},404);if(method==='DELETE'){this.productos.splice(i,1);return json({})}const producto={...this.productos[i],...data,id};this.productos[i]=producto;return json(producto)}
  }
  return json({error:'Ruta desconocida: '+key},404);
 }
};
