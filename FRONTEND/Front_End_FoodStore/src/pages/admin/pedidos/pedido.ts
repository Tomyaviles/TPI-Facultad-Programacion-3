import type { IDetallePedido } from "../../../types/IDetallePedido";
import type { IUser } from "../../../types/IUser";

import { navigate } from "../../../utils/navigate";



export interface IUsuarioDto {
    id: number;
    nombre: string;
    apellido: string;
    mail: string;
    celular: string;
    rol: string;
}

export interface IOrder {
    id: number;
    fecha: string;
    estado: "PENDIENTE" | "EN_PREPARACION" | "ENTREGADO" | "CANCELADO";
    total: number;
    formaPago: string;
    detalles: IDetallePedido[];
    usuarioDto: IUsuarioDto;
    direccion?: string; // Opcional por si no viene en el JSON
    envio?: number;     // Opcional por si no viene en el JSON
}

// Array principal donde guardaremos los pedidos traídos de la API/JSON
let orders: IOrder[] = [];

// Variable global para seguir la pista de qué pedido tenemos abierto en detalle
let selectedOrder: IOrder | null = null;

// Capturas del DOM
const ordersListContainer = document.getElementById("ordersList") as HTMLDivElement;
const filterStatusSelect = document.getElementById("filterStatus") as HTMLSelectElement;

// Modal DOM
const orderModal = document.getElementById("orderModal") as HTMLDivElement;
const btnCloseModal = document.getElementById("btnCloseModal") as HTMLButtonElement;
const modalOrderTitle = document.getElementById("modalOrderTitle") as HTMLHeadingElement;

// Modal Campos de Detalle
const detailCliente = document.getElementById("detailCliente") as HTMLSpanElement;
const detailFecha = document.getElementById("detailFecha") as HTMLSpanElement;
const detailTelefono = document.getElementById("detailTelefono") as HTMLSpanElement;
const detailDireccion = document.getElementById("detailDireccion") as HTMLSpanElement;
const detailPago = document.getElementById("detailPago") as HTMLSpanElement;
const detailProductsList = document.getElementById("detailProductsList") as HTMLDivElement;

const detailSubtotal = document.getElementById("detailSubtotal") as HTMLSpanElement;
const detailEnvio = document.getElementById("detailEnvio") as HTMLSpanElement;
const detailTotal = document.getElementById("detailTotal") as HTMLSpanElement;

// Actualización de estado
const updateStatusSelect = document.getElementById("updateStatusSelect") as HTMLSelectElement;
const btnUpdateStatus = document.getElementById("btnUpdateStatus") as HTMLButtonElement;

// Inicialización asíncrona del script
async function init() {
    setupEventListeners();
    await fetchOrders(); // Traemos los pedidos antes de renderizar
}

// Función para obtener los datos con fetch
async function fetchOrders() {
    try {
        // Reemplaza la ruta por la URL de tu API o la ruta de tu JSON local
        const response = await fetch('/data/pedidos.json');

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        orders = await response.json();
        renderOrders();

    } catch (error) {
        console.error("Error al cargar los pedidos:", error);
        if (ordersListContainer) {
            ordersListContainer.innerHTML = `<p style="text-align:center; color:red; margin-top:20px;">No se pudieron cargar los pedidos.</p>`;
        }
    }
}

// Escuchadores de eventos globales
function setupEventListeners() {
    filterStatusSelect.addEventListener("change", () => {
        renderOrders();
    });

    btnCloseModal.addEventListener("click", closeModal);
    orderModal.addEventListener("click", (e) => {
        if (e.target === orderModal) {
            closeModal();
        }
    });

    btnUpdateStatus.addEventListener("click", () => {
        if (selectedOrder) {
            const nuevoEstado = updateStatusSelect.value as IOrder["estado"];
            selectedOrder.estado = nuevoEstado;
            
            orders = orders.map(ord => ord.id === selectedOrder!.id ? { ...ord, estado: nuevoEstado } : ord);
            
            alert(`Estado del pedido #${selectedOrder.id} actualizado a: ${nuevoEstado}`);
            renderOrders();
            closeModal();
        }
    });
}

// Renderiza la lista principal de Pedidos
function renderOrders() {
    ordersListContainer.innerHTML = "";
    const filterValue = filterStatusSelect.value;

    const filteredOrders = orders.filter(ord => {
        if (filterValue === "todos") return true;
        return ord.estado === filterValue;
    });

    if (filteredOrders.length === 0) {
        ordersListContainer.innerHTML = `<p style="text-align:center; color:#888; margin-top:20px;">No se encontraron pedidos.</p>`;
        return;
    }

    filteredOrders.forEach(order => {
        // Contamos total de productos usando order.detalles
        const totalProductos = order.detalles.reduce((sum, item) => sum + item.cantidad, 0);
        const costoEnvio = order.envio ?? 0;
        const totalFinal = order.total + costoEnvio;

        const card = document.createElement("div");
        card.className = "order-card";
        card.addEventListener("click", () => openOrderDetail(order));

        card.innerHTML = `
            <div class="order-info-left">
                <h4>Pedido #${order.id}</h4>
                <p>Cliente: ${order.usuarioDto.nombre} ${order.usuarioDto.apellido}</p>
                <p>${order.fecha}</p>
                <p class="product-count">${totalProductos} producto(s)</p>
            </div>
            <div class="order-info-right">
                <span class="badge-status ${order.estado.toLowerCase()}">${order.estado}</span>
                <span class="order-total-price">$${totalFinal.toFixed(2)}</span>
            </div>
        `;
        ordersListContainer.appendChild(card);
    });
}

// Abrir el detalle del pedido en el modal
function openOrderDetail(order: IOrder) {
    selectedOrder = order;

    modalOrderTitle.innerText = `Detalle del Pedido #${order.id}`;

    // Mapeo de datos del usuarioDto en el JSON
    detailCliente.innerText = `${order.usuarioDto.nombre} ${order.usuarioDto.apellido}`;
    detailFecha.innerText = order.fecha;
    detailTelefono.innerText = order.usuarioDto.celular;
    detailDireccion.innerText = order.direccion || "Retiro en local";
    detailPago.innerText = order.formaPago;

    detailProductsList.innerHTML = "";

    // Mapeo de items usando order.detalles
    order.detalles.forEach(item => {
        const pRow = document.createElement("div");
        pRow.className = "product-item-row";
        pRow.innerHTML = `
            <div class="product-item-left">
                <div class="p-name">${item.producto.nombre}</div>
                <div class="p-qty">Cantidad: ${item.cantidad} x $${item.producto.precio}</div>
            </div>
            <div class="product-item-price">$${item.subtotal.toFixed(2)}</div>
        `;
        detailProductsList.appendChild(pRow);
    });

    const costoEnvio = order.envio ?? 0;

    detailSubtotal.innerText = `$${order.total.toFixed(2)}`;
    detailEnvio.innerText = `$${costoEnvio.toFixed(2)}`;
    detailTotal.innerText = `$${(order.total + costoEnvio).toFixed(2)}`;

    updateStatusSelect.value = order.estado;
    orderModal.classList.add("active");
}

function closeModal() {
    orderModal.classList.remove("active");
    selectedOrder = null;
}

document.addEventListener("DOMContentLoaded", init);



const categoria_link = document.getElementById("categoria_link")

const producto_link = document.getElementById("producto_link")

const dashboard_link = document.getElementById("dashboard_link")

const pedido_link = document.getElementById("pedido_link")


pedido_link?.addEventListener("click", () => {
    navigate("/src/pages/admin/pedidos/pedido.html")
})

dashboard_link?.addEventListener("click", () => {
    navigate("/src/pages/admin/homeAdmin/admin_home.html")
})




producto_link?.addEventListener("click", () => {
  navigate("/src/pages/admin/productos/producto.html")
})

categoria_link?.addEventListener("click", () => {
  navigate("/src/pages/admin/categorias/categoria.html")
})

const logout = document.getElementById("logout") as HTMLLinkElement

logout.addEventListener("click", () => {
    const UserJson = localStorage.getItem("userData")
    if(!UserJson) return;
    const userActual = JSON.parse(UserJson);

    const UsersJson = localStorage.getItem("users") || '[]'
    const users: IUser[] = JSON.parse(UsersJson)

    users.map((u: any) => {
        if(u.email === userActual.email){
            return {...u, loggedIn : false};
        }
        return u;
    })

    // 4. Guardar cambios
    localStorage.setItem("users", JSON.stringify(users));

    // 5. Eliminar sesión actual
    localStorage.removeItem("userData");

    navigate("/src/pages/auth/login/login.html")
})
