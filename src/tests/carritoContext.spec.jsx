import React from 'react';
import {useCarrito} from '../context/CarritoContext.jsx';
import {montar,pulsar} from './utils.jsx';
const producto={id:100,nombre:'Test',precio:12.5,imagen:'img/1.jpg'};
function Probe(){const x=useCarrito();return <><span id="count">{x.carrito.length}</span><span id="total">{x.total}</span><span id="first">{x.carrito[0]?.nombre||''}</span><button id="add" onClick={()=>x.agregar(producto)}>Agregar</button><button id="add2" onClick={()=>x.agregar({...producto,nombre:'Otro',precio:3})}>Otro</button><button id="remove" onClick={()=>x.eliminar(0)}>Eliminar</button><button id="clear" onClick={x.vaciar}>Vaciar</button></>}
describe('CarritoContext',()=>{let vista;beforeEach(()=>localStorage.clear());afterEach(async()=>{if(vista)await vista.desmontar();vista=null});
 it('11. Inicia vacío con total cero',async()=>{vista=await montar(<Probe/>);expect(vista.container.querySelector('#count').textContent).toBe('0');expect(vista.container.querySelector('#total').textContent).toBe('0')});
 it('12. Agregar incorpora producto y calcula total',async()=>{vista=await montar(<Probe/>);await pulsar(vista.container.querySelector('#add'));expect(vista.container.querySelector('#count').textContent).toBe('1');expect(vista.container.querySelector('#total').textContent).toBe('12.5')});
 it('13. Eliminar quita solamente el producto indicado',async()=>{vista=await montar(<Probe/>);await pulsar(vista.container.querySelector('#add'));await pulsar(vista.container.querySelector('#add2'));await pulsar(vista.container.querySelector('#remove'));expect(vista.container.querySelector('#first').textContent).toBe('Otro')});
 it('14. Vaciar deja el carrito en cero',async()=>{vista=await montar(<Probe/>);await pulsar(vista.container.querySelector('#add'));await pulsar(vista.container.querySelector('#clear'));expect(vista.container.querySelector('#total').textContent).toBe('0')});
 it('15. Persiste en almacenamiento local',async()=>{vista=await montar(<Probe/>);await pulsar(vista.container.querySelector('#add'));expect(JSON.parse(localStorage.getItem('carrito')).length).toBe(1)});
 it('16. Restaura productos guardados',async()=>{localStorage.setItem('carrito',JSON.stringify([producto]));vista=await montar(<Probe/>);expect(vista.container.querySelector('#count').textContent).toBe('1')});
 it('17. Tolera un JSON corrupto',async()=>{localStorage.setItem('carrito','INVALIDO');vista=await montar(<Probe/>);expect(vista.container.querySelector('#count').textContent).toBe('0')});
 it('18. Convierte precios escritos como texto',async()=>{localStorage.setItem('carrito',JSON.stringify([{...producto,precio:'12,50'}]));vista=await montar(<Probe/>);expect(vista.container.querySelector('#total').textContent).toBe('12.5')});
});
