import React,{useState} from 'react';
import {Layout} from '../components/Layout.jsx';
import {GridProductos} from '../components/Tienda.jsx';
import {productos as productosDemo} from '../data/productos.js';
import {useProductos} from '../context/ProductosContext.jsx';
export default function Productos(){const [categoria,setCategoria]=useState('Todos');const estado=useProductos();const productos=estado?estado.productos:productosDemo;const categorias=['Todos',...new Set(productos.map(p=>p.categoria))];return <Layout><section className="container seccion-react"><h1>Productos</h1><p>Explora nuestro catálogo.</p><div className="categorias-react">{categorias.map(c=><button key={c} type="button" className={'btn '+(c===categoria?'btn-success':'btn-outline-success')} onClick={()=>setCategoria(c)}>{c}</button>)}</div><GridProductos categoria={categoria}/></section></Layout>}
