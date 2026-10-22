import React, {createContext, useContext, useMemo, useState} from 'react';

// Solo demostración académica. La verificación ocurre en el navegador: NO es autenticación segura.
const CUENTAS = 'hms_demo_accounts_v1';
const SESION = 'hms_demo_session_v1';
const AuthContext = createContext(null);
// Credenciales públicas para DEMOSTRACIÓN, no aptas para producción.
const ADMIN_DEMO = {correo:'admin@homemaster.demo', password:'AdminDemo2026!'};
const leerJSON = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const emailNormalizado = value => value.trim().toLowerCase();
const bytesHex = bytes => [...bytes].map(x => x.toString(16).padStart(2, '0')).join('');
const hexBytes = hex => new Uint8Array((hex.match(/.{2}/g) || []).map(x => parseInt(x,16)));
async function derivarClave(password, salt) {
  const encoded = new TextEncoder().encode(password);
  const key = await crypto.subtle.importKey('raw', encoded, 'PBKDF2', false, ['deriveBits']);
  const derived = await crypto.subtle.deriveBits({name:'PBKDF2', salt:hexBytes(salt), iterations:150000, hash:'SHA-256'}, key, 256);
  return bytesHex(new Uint8Array(derived));
}
export function AuthProvider({children}) {
  const [usuario, setUsuario] = useState(() => {
    const sesion = leerJSON(SESION, null);
    // Las sesiones de usuario normal nunca heredan roles administrativos del almacenamiento local.
    return sesion?.correo === ADMIN_DEMO.correo && sesion?.id === 'administrador-demo'
      ? {...sesion, rol:'Administrador'}
      : sesion ? {...sesion, rol:'Cliente'} : null;
  });
  const registrar = async ({nombre, apellidos, correo, password}) => {
    const email = emailNormalizado(correo);
    if (!nombre.trim() || !apellidos.trim() || !email || !password) throw Error('Completa todos los campos.');
    if (password.length < 8) throw Error('La contraseña de demostración debe tener al menos 8 caracteres.');
    const cuentas = leerJSON(CUENTAS, []);
    if (email === ADMIN_DEMO.correo) throw Error('Este correo está reservado para la cuenta de demostración.');
    if (cuentas.some(x=>x.correo===email)) throw Error('Este correo ya está registrado.');
    const salt = bytesHex(crypto.getRandomValues(new Uint8Array(16)));
    const verifier = await derivarClave(password, salt);
    const id = crypto.randomUUID();
    const perfil = {id, nombre:nombre.trim(), apellidos:apellidos.trim(), correo:email, rol:'Cliente'};
    localStorage.setItem(CUENTAS, JSON.stringify([...cuentas, {...perfil, salt, verifier}]));
    localStorage.setItem(SESION, JSON.stringify(perfil));
    setUsuario(perfil);
    return perfil;
  };
  const iniciarSesion = async (correo, password) => {
    if (emailNormalizado(correo) === ADMIN_DEMO.correo && password === ADMIN_DEMO.password) {
      const perfil = {id:'administrador-demo', nombre:'Administrador', apellidos:'Demo', correo:ADMIN_DEMO.correo, rol:'Administrador'};
      localStorage.setItem(SESION, JSON.stringify(perfil));
      setUsuario(perfil);
      return perfil;
    }
    const cuenta = leerJSON(CUENTAS, []).find(x=>x.correo===emailNormalizado(correo));
    if (!cuenta || !password || (await derivarClave(password, cuenta.salt)) !== cuenta.verifier) {
      throw Error('Correo o contraseña incorrectos.');
    }
    const {id, nombre, apellidos, correo:email} = cuenta;
    const perfil = {id, nombre, apellidos, correo:email, rol:'Cliente'};
    localStorage.setItem(SESION, JSON.stringify(perfil));
    setUsuario(perfil);
    return perfil;
  };
  const cerrarSesion = () => { localStorage.removeItem(SESION); setUsuario(null); };
  const value = useMemo(()=>({usuario, registrar, iniciarSesion, cerrarSesion}),[usuario]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth(){const value=useContext(AuthContext);if(!value)throw Error('Falta AuthProvider');return value;}
