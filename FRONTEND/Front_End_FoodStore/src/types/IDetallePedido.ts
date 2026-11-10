import type { Product } from "./Product";

export interface IDetallePedido {
    cantidad: number;
    subtotal: number;
    producto: Product;
}