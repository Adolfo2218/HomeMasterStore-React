import React from 'react';
import {Link} from 'react-router-dom';
import {Layout} from '../components/Layout.jsx';
import {GridProductos,TabsProductos} from '../components/Tienda.jsx';
export default function Inicio(){return <Layout><section className="portada-react"><div className="container portada-contenido"><h1>Home Master Store</h1><p>Descubre semillas y productos para tu hogar y jardín.</p><Link className="btn btn-success btn-lg" to="/productos">Ver productos</Link></div></section><section className="container seccion-react"><h2>Productos populares</h2><TabsProductos/></section><section className="container seccion-react"><h2>Descubre nuestros productos</h2><GridProductos categoria="Todos"/></section></Layout>}
