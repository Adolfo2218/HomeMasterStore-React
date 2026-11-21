import React, {createContext, useCallback, useContext, useEffect, useState} from 'react';
import {obtenerProductos} from '../services/productosApi.js';

const ProductosContext = createContext(null);

/** La aplicación real lee desde Spring Boot. Sin Provider, se usan fixtures de test. */
export function ProductosProvider({children}) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  const recargar = useCallback(() => setRevision(x => x + 1), []);
  useEffect(() => {
    const controlador = new AbortController();
    setCargando(true);
    setError('');
    obtenerProductos({signal: controlador.signal})
      .then(setProductos)
      .catch(err => {
        if (!controlador.signal.aborted) {setProductos([]); setError(err.message || 'Error de conexión');}
      })
      .finally(() => {if (!controlador.signal.aborted) setCargando(false);});
    return () => controlador.abort();
  }, [revision]);
  return <ProductosContext.Provider value={{productos, cargando, error, recargar}}>{children}</ProductosContext.Provider>;
}

export const useProductos = () => useContext(ProductosContext);
