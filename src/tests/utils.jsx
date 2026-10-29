import React from 'react';
import {createRoot} from 'react-dom/client';
import {act} from 'react';
import {MemoryRouter} from 'react-router-dom';
import {AuthProvider} from '../context/AuthContext.jsx';
import {CarritoProvider} from '../context/CarritoContext.jsx';
export async function montar(element,{auth=true,cart=true,router=true}={}) {
 const container=document.createElement('div');document.body.appendChild(container);
 const root=createRoot(container);
 let tree=element;
 if(cart) tree=<CarritoProvider>{tree}</CarritoProvider>;
 if(auth) tree=<AuthProvider>{tree}</AuthProvider>;
 if(router) tree=<MemoryRouter>{tree}</MemoryRouter>;
 await act(async()=>{root.render(tree)});
 return {container,root,desmontar:async()=>{await act(async()=>root.unmount());container.remove()}};
}
export async function pulsar(element){if(!element)throw Error('Elemento no encontrado');await act(async()=>element.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true})));}
export async function cambiar(element,value){if(!element)throw Error('Campo no encontrado');const setter=Object.getOwnPropertyDescriptor(element instanceof HTMLTextAreaElement?HTMLTextAreaElement.prototype:element instanceof HTMLSelectElement?HTMLSelectElement.prototype:HTMLInputElement.prototype,'value').set;await act(async()=>{setter.call(element,value);element.dispatchEvent(new Event('input',{bubbles:true}));element.dispatchEvent(new Event('change',{bubbles:true}));});}
export async function enviar(form){await act(async()=>form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));}
export const esperar=async(condicion,intentos=30)=>{for(let i=0;i<intentos;i++){if(condicion())return;await act(async()=>new Promise(r=>setTimeout(r,20)))}throw Error('Tiempo de espera agotado')};
export const admin={id:'administrador-demo',nombre:'Administrador',apellidos:'Demo',correo:'admin@homemaster.demo',rol:'Administrador'};
