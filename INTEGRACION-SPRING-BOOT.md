# Etapa 2 — Integración de catálogo React y Spring Boot

## Requisitos
- Spring Boot iniciado en `http://localhost:8080` con `mvn spring-boot:run`.
- Vite iniciado con `npm run dev` (normalmente `http://localhost:5173`).

## Qué se integró
- `src/services/productosApi.js` consulta `GET /api/productos`.
- `src/context/ProductosContext.jsx` centraliza carga, error y reintento con `useEffect`.
- `GridProductos`, `TabsProductos` y la página `Productos` usan los productos de la API dentro de la app.
- Vite reenvía `/api` a Spring Boot para evitar problemas de origen cruzado durante desarrollo.
- El carrito sigue utilizando `localStorage` y las tarjetas reciben productos del servidor.

## Comprobación manual
1. Mantener Spring Boot encendido.
2. Ejecutar `npm install`, `npm run dev` y abrir la tienda.
3. Confirmar que Inicio y Productos muestran los 16 registros de H2.
4. Abrir DevTools > Network y verificar `GET /api/productos` con HTTP 200.
5. Agregar un producto al carrito, recargar y verificar la persistencia.
6. Detener Spring Boot, refrescar y confirmar que se muestra el error y el botón «Reintentar».
7. Reiniciar Spring Boot y pulsar «Reintentar».

## Límites de esta etapa
- El login, el registro y la administración de usuarios siguen siendo demostraciones locales, sin JWT. No son seguridad real.
- Las operaciones de escritura del backend aún no están protegidas. Usar localmente y no exponer el puerto 8080 a Internet.
- Para desplegar React fuera de Vite será necesario configurar la URL/API o un proxy en el servidor de producción.
- El catálogo local (`src/data/productos.js`) se mantiene solo como fixture de las pruebas de la evaluación anterior. En la aplicación real el proveedor obtiene los productos desde Spring Boot.
- Las pruebas anteriores que montan componentes aislados siguen usando sus fixtures, por lo que aún no prueban la integración HTTP. Añadir pruebas de integración de la API en la etapa correspondiente.
