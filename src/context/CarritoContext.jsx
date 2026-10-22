import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
const CarritoContext = createContext(null);
export function CarritoProvider({children}) {
  const [carrito,setCarrito] = useState(() => { try { return JSON.parse(localStorage.getItem('carrito')||'[]'); } catch { return []; } });
  useEffect(()=>localStorage.setItem('carrito',JSON.stringify(carrito)),[carrito]);
  const agregar = (producto) => setCarrito(anterior=>[...anterior,producto]);
  const eliminar = (index) => setCarrito(anterior=>anterior.filter((_,i)=>i!==index));
  const vaciar = () => setCarrito([]);
  const total = useMemo(()=>carrito.reduce((s,p)=>s+(typeof p.precio === 'number'?p.precio:Number(String(p.precio).replace(/[^0-9.,]/g,'').replace(',','.'))||0),0),[carrito]);
  return <CarritoContext.Provider value={{carrito,agregar,eliminar,vaciar,total}}>{children}</CarritoContext.Provider>;
}
export const useCarrito=()=>useContext(CarritoContext);
