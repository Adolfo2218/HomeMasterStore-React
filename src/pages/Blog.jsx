import React from 'react';
import {Link,useParams} from 'react-router-dom';
import {Layout} from '../components/Layout.jsx';
import {articulos} from '../data/articulos.js';
export function Blog(){return <Layout><section className="container seccion-react"><h1>Blog</h1><div className="blog-grid-react">{articulos.map(a=><article key={a.slug} className="blog-card-react"><img src={'/'+a.imagen} alt=""/><h2>{a.titulo}</h2><Link to={'/blogs/'+a.slug}>Leer más</Link></article>)}</div></section></Layout>}
export function Articulo(){const {slug}=useParams();const articulo=articulos.find(a=>a.slug===slug);if(!articulo)return <Layout><section className="container seccion-react"><h1>Artículo no encontrado</h1><Link to="/blog">Volver al blog</Link></section></Layout>;return <Layout><article className="container seccion-react"><Link to="/blog">← Volver al blog</Link><p className="text-muted mt-4">{articulo.fecha}</p><h1>{articulo.titulo}</h1><img className="imagen-pagina" src={'/'+articulo.imagen} alt={articulo.titulo}/>{articulo.contenido.map((parrafo,i)=><p key={i}>{parrafo}</p>)}</article></Layout>}
