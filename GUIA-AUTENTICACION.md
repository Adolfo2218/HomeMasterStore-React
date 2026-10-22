# Registro e inicio de sesión de demostración

Se mantiene la tienda, catálogo y carrito de la versión corregida.

## Probar

1. `npm install` (no utilizar `npm audit fix --force`).
2. `npm run dev`.
3. Entrar a **Login > Regístrate**, crear una cuenta con datos inventados y una contraseña de demostración de mínimo 8 caracteres.
4. Tras registrarse se inicia sesión y la cabecera muestra **Hola, ...** y **Cerrar sesión**.
5. Pulsar **Cerrar sesión**, volver a **Login** e ingresar con el correo y contraseña de demostración.
6. Actualizar con F5: se conserva la sesión hasta pulsar **Cerrar sesión**.
7. Comprobar el carrito antes y después.

## Advertencia sobre seguridad

Esto NO es autenticación real. Los perfiles y un verificador PBKDF2 con sal se conservan localmente. No se guardan contraseñas en texto plano, pero la comprobación y la sesión ocurren en el navegador y pueden manipularse. Usar únicamente datos y claves ficticios. Se necesita backend y control de acceso del lado servidor para una aplicación real.

Las cuentas de demostración de este módulo son independientes de la vista heredada de administración de usuarios. Esta vista también requiere backend y autorización antes de uso real.
