# Home Master Store — React (migración limpia)

Tienda académica creada con **React + Vite + React Router + Bootstrap**, sin imports de los HTML originales. `index.html` en la raíz es el archivo contenedor normal de Vite.

## Iniciar

```bash
npm install
npm run dev
npm run build
```

## Estructura

- `src/pages/`: vistas React: Inicio, Productos, Nosotros, Contacto, Blog, Login, Registro y administración.
- `src/components/`: navegación, layout, tarjetas y carrito.
- `src/context/`: carrito y autenticación de demostración.
- `src/data/`: catálogo, usuarios de muestra y textos del blog convertidos a datos JavaScript.
- `public/`: imágenes y estilos originales.

## Funcionalidades

- Catálogo, filtros por categoría y carrito persistente en localStorage.
- Registro e inicio/cierre de sesión **simulados localmente**, con perfiles ficticios.
- Acceso de administración ilustrativo: `admin@homemaster.demo` / `AdminDemo2026!`.
- Listado, búsqueda, filtro, creación y eliminación de usuarios de administración **de muestra**.
- Formulario de contacto de demostración: no envía mensajes a un servidor.
- Blog con contenido recuperado de los tres artículos HTML originales.

**Advertencias**: No usar contraseñas reales ni datos personales reales. No es autenticación segura; no hay backend. Las cuentas de registro y la lista administrativa son conjuntos separados. La compra es simulada. Parte del catálogo original trae precios `0` y nombres de ejemplo. No se han confirmado pruebas automatizadas ejecutadas.

## GitHub

El `.gitignore` excluye `node_modules`, `dist` y archivos locales. Ejecutar `npm run build` antes de publicar. No publicar cuentas reales ni datos sensibles.

## Pruebas unitarias (Jasmine + Karma)

Se incluyen 65 casos distribuidos en cinco especificaciones de `src/tests`.
Tras instalar dependencias con `npm install`, usa `npm test` para ejecutarlos.
Karma está configurado inicialmente para ChromeHeadless. En Windows con Edge Chromium,
puedes usar en CMD `set "CHROME_BIN=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"`
(si tu Edge está instalado ahí) antes de `npm test`.

Para obtener un informe de cobertura instala las dependencias adicionales:
`npm install --save-dev karma-coverage babel-plugin-istanbul`
y ejecuta `npx karma start karma.coverage.conf.cjs --single-run`.
El informe HTML se encuentra en `coverage/html/index.html`.
Las pruebas asíncronas usan Web Crypto; se requiere un navegador moderno.
**No se ha confirmado en este entorno que los 65 casos terminen exitosamente:**
comprueba y corrige los resultados en tu máquina antes de reportarlos.
