# Home Master Store React — Administración de demostración y GitHub

## Administración (simulación académica)

1. Ejecutar `npm install`, `npm run dev`.
2. Abrir **Login** y entrar con `admin@homemaster.demo` / `AdminDemo2026!`.
3. Aparece **Administración** en la cabecera. Permite listar, filtrar, crear y eliminar usuarios del listado de ejemplo.
4. Al cerrar sesión, desaparece el acceso administrativo. Una cuenta creada desde Registro solo obtiene rol Cliente.
5. Si un cliente visita `/usuarios` o `/nuevou`, se muestra Acceso restringido.

**Límite de seguridad:** las credenciales del administrador están escritas en el código público y el estado del usuario está en `localStorage`. La restricción de rutas y las operaciones CRUD son una **simulación en el navegador**, no autorización real; no usar con datos privados o contraseñas reales. La administración de usuarios usa un listado de demostración separado de las cuentas de login.

## GitHub

Publicar desde la carpeta `Fullstack2-React`, **no** desde una carpeta con `node_modules` versionado.

```bash
git init
git add .
git commit -m "Migracion Home Master Store a React con autenticacion demo y administracion"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin main
```

Crear antes un repositorio **vacío y público** en GitHub. Reemplazar URL con la del repositorio real. Si ya hay un remoto `origin`, comprobar con `git remote -v` y usar `git remote set-url origin URL` en vez de añadir otro. No subir `.env`, `node_modules` ni información real.

## Verificación

```bash
npm install
npm run build
npm run dev
```

Probar: catálogo, carrito, registro y login cliente, login administrador, administración, cierre de sesión y bloqueo de acceso a `/usuarios` desde cliente.
