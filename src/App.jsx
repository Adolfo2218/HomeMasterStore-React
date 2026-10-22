import React, {useEffect} from 'react';
import {Routes,Route,Link,useLocation} from 'react-router-dom';
import {CarritoProvider} from './context/CarritoContext.jsx';
import {AuthProvider} from './context/AuthContext.jsx';
import {Layout,SoloAdministrador} from './components/Layout.jsx';
import {CarritoPagina} from './components/Tienda.jsx';
import Inicio from './pages/Inicio.jsx';
import Productos from './pages/Productos.jsx';
import Nosotros from './pages/Nosotros.jsx';
import Contacto from './pages/Contacto.jsx';
import {Blog,Articulo} from './pages/Blog.jsx';
import {Usuarios,NuevoUsuario} from './pages/Usuarios.jsx';
import {Login} from './pages/Login.jsx';
import {Registro} from './pages/Registro.jsx';
import './styles/ajustes.css';
function Desconocida(){return <Layout><section className="container seccion-react"><h1>Página no encontrada</h1><Link to="/">Volver al inicio</Link></section></Layout>}
function ScrollTop(){const {pathname}=useLocation();useEffect(()=>{window.scrollTo(0,0)},[pathname]);return null}
export default function App(){return <AuthProvider><CarritoProvider><ScrollTop/><Routes>
<Route path="/" element={<Inicio/>}/><Route path="/index" element={<Inicio/>}/>
<Route path="/productos" element={<Productos/>}/><Route path="/carrito" element={<CarritoPagina/>}/>
<Route path="/login" element={<Layout><Login/></Layout>}/><Route path="/registrar" element={<Layout><Registro/></Layout>}/>
<Route path="/usuarios" element={<SoloAdministrador><Layout><Usuarios/></Layout></SoloAdministrador>}/>
<Route path="/nuevou" element={<SoloAdministrador><Layout><NuevoUsuario/></Layout></SoloAdministrador>}/>
<Route path="/nosotros" element={<Nosotros/>}/><Route path="/contacto" element={<Contacto/>}/>
<Route path="/blog" element={<Blog/>}/><Route path="/blogs/:slug" element={<Articulo/>}/>
<Route path="*" element={<Desconocida/>}/></Routes></CarritoProvider></AuthProvider>}
