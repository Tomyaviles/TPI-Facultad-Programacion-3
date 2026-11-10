import type { IDetallePedido } from "./IDetallePedido";
import type { IUser } from "./IUser";

export interface IOrder {
    id: number;
    fecha: string;
    estado: "PENDIENTE" | "EN_PREPARACION" | "ENTREGADO" | "CANCELADO";
    total: number;
    formaPago: string;
    detalles: IDetallePedido[];
    usuario: IUser;
    direccion?: string;
    envio?: number;
}