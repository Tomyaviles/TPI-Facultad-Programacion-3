import type { Product } from "./Product";

// Estructura de los elementos del carrito
export interface ICartItem {
    id: number;
        nombre: string;
        descripcion: string;
        precioUnitario: number;
        cantidad: number;
        imagenUrl: string;
        productoOriginal: Product;
}