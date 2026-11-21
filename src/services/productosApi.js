/** Acceso al backend Spring Boot mediante el proxy /api de Vite. */
export async function obtenerProductos({signal} = {}) {
  const respuesta = await fetch('/api/productos', {signal, headers: {Accept: 'application/json'}});
  if (!respuesta.ok) throw new Error(`El servidor respondió HTTP ${respuesta.status}`);
  const datos = await respuesta.json();
  if (!Array.isArray(datos)) throw new Error('La API no devolvió una lista de productos');
  return datos.map((p) => ({
    ...p,
    id: Number(p.id),
    precio: Number(p.precio),
    ...(p.precioAnterior != null ? {precioAnterior: Number(p.precioAnterior)} : {})
  }));
}
