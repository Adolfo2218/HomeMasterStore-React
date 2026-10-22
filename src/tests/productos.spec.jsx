import {productos} from '../data/productos.js';
describe('Catálogo - pruebas unitarias Jasmine',()=>{
 it('1. El catálogo es un arreglo',()=>expect(Array.isArray(productos)).toBeTrue());
 it('2. Contiene 16 productos',()=>expect(productos.length).toBe(16));
 it('3. Cada producto tiene ID',()=>expect(productos.every(p=>Number.isInteger(p.id))).toBeTrue());
 it('4. No existen IDs duplicados',()=>expect(new Set(productos.map(p=>p.id)).size).toBe(productos.length));
 it('5. Cada producto tiene nombre',()=>expect(productos.every(p=>!!p.nombre)).toBeTrue());
 it('6. Cada producto tiene una imagen',()=>expect(productos.every(p=>p.imagen.startsWith('img/'))).toBeTrue());
 it('7. Los precios son numéricos',()=>expect(productos.every(p=>typeof p.precio==='number')).toBeTrue());
 it('8. No hay precios negativos',()=>expect(productos.every(p=>p.precio>=0)).toBeTrue());
 it('9. Existen semillas',()=>expect(productos.some(p=>p.categoria==='Semillas')).toBeTrue());
 it('10. Filtrado por packs devuelve 4 productos',()=>expect(productos.filter(p=>p.categoria==='Packs').length).toBe(4));
});
