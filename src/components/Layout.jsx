import React from 'react';
import {Link} from 'react-router-dom';
import {Header} from './Tienda.jsx';
import {useAuth} from '../context/AuthContext.jsx';
export function Layout({children}) {return <><Header/><main className="pagina-react">{children}</main><Footer/></>}
export function Footer(){return <footer className="footer-react"><div className="container"><strong>Home Master Store</strong><p>Semillas, packs y artículos para tu hogar y jardín.</p><nav><Link to="/">Inicio</Link><Link to="/productos">Productos</Link><Link to="/contacto">Contacto</Link></nav></div></footer>}
export function SoloAdministrador({children}) {const {usuario,cargandoSesion}=useAuth();if(cargandoSesion)return <Layout><main className="container py-5" role="status">Comprobando sesión...</main></Layout>;if(usuario?.rol!=='Administrador')return <Layout><section className="container seccion-react"><h1>Acceso restringido</h1><p>Esta sección es exclusiva del administrador de demostración.</p><Link to="/login">Ir al inicio de sesión</Link></section></Layout>;return children;}
