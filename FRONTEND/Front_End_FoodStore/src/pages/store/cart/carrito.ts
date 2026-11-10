
import type { IUser } from "../../../types/IUser";
;
import { navigate } from "../../../utils/navigate";

import type { Product } from "../../../types/Product";
import type { ICartItem } from "../../../types/ICartItem";
import type { IDetallePedido } from "../../../types/IDetallePedido";
import type { IOrder } from "../../admin/pedidos/pedido";

export interface IUsuarioDto {
    id: number;
    nombre: string;
    apellido: string;
    mail: string;
    celular: string;
    rol: string;
}





let cart: ICartItem[] = [];
const COSTO_ENVIO = 500;

// Capturas de Elementos del DOM
const cartListContainer = document.getElementById("cartList") as HTMLDivElement;
const cartBadge = document.getElementById("cartBadge") as HTMLSpanElement;

// Textos de Precios (Resumen)
const summarySubtotal = document.getElementById("summarySubtotal") as HTMLSpanElement;
const summaryEnvio = document.getElementById("summaryEnvio") as HTMLSpanElement;
const summaryTotal = document.getElementById("summaryTotal") as HTMLSpanElement;

// Acciones principales
const btnProceedToPay = document.getElementById("btnProceedToPay") as HTMLButtonElement;
const btnEmptyCart = document.getElementById("btnEmptyCart") as HTMLButtonElement;

// Elementos de la Ventana Modal
const checkoutModal = document.getElementById("checkoutModal") as HTMLDivElement;
const btnCloseModal = document.getElementById("btnCloseModal") as HTMLButtonElement;
const modalTotalAmount = document.getElementById("modalTotalAmount") as HTMLSpanElement;
const checkoutForm = document.getElementById("checkoutForm") as HTMLFormElement;

// Inputs del formulario modal
const inputPhone = document.getElementById("inputPhone") as HTMLInputElement;
const inputAddress = document.getElementById("inputAddress") as HTMLTextAreaElement;
const selectPayment = document.getElementById("selectPayment") as HTMLSelectElement;
const inputNotes = document.getElementById("inputNotes") as HTMLTextAreaElement;

function init() {
    InitCart();
    renderCart();
    setupEventListeners();
}

function InitCart() {
    const productoJson = localStorage.getItem("cart") || '[]';
    let cartProduct: Product[] = JSON.parse(productoJson);

    cart = cartProduct.map((product) => {
        const itemCart: ICartItem = {
            id: product.id,
            nombre: product.nombre,
            descripcion: product.descripcion,
            precioUnitario: product.precio,
            cantidad: 1,
            imagenUrl: product.imagen,
            productoOriginal: product // Mantenemos el objeto completo con categoria, stock, etc.
        };
        return itemCart;
    });
}

function setupEventListeners() {
    btnEmptyCart.addEventListener("click", () => {
        if (cart.length > 0 && confirm("¿Estás seguro de que deseas vaciar tu carrito?")) {
            cart = [];
            localStorage.removeItem("cart");
            renderCart();
        }
    });

    btnProceedToPay.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Tu carrito está vacío. Agrega productos antes de pagar.");
            return;
        }
        openCheckoutModal();
    });

    btnCloseModal.addEventListener("click", closeCheckoutModal);
    checkoutModal.addEventListener("click", (e) => {
        if (e.target === checkoutModal) closeCheckoutModal();
    });

    
    checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();

        
        const userJson = localStorage.getItem("userData");
        const userActual = userJson ? JSON.parse(userJson) : null;

        const usuarioDto: IUsuarioDto = {
            id: userActual?.id || 1,
            nombre: userActual?.nombre || "Cliente",
            apellido: userActual?.apellido || "Anónimo",
            mail: userActual?.email || userActual?.mail || "cliente@mail.com",
            celular: inputPhone.value || userActual?.celular || "1111111111",
            rol: userActual?.rol || "USUARIO"
        };

       //Mapear el carrito a los 'detalles' con el formato exacto del JSON
        const detalles: IDetallePedido[] = cart.map(item => {
            return {
                cantidad: item.cantidad,
                subtotal: item.cantidad * item.precioUnitario,
                producto: {
                    id: item.productoOriginal.id,
                    nombre: item.productoOriginal.nombre,
                    precio: item.productoOriginal.precio,
                    descripcion: item.productoOriginal.descripcion,
                    stock: item.productoOriginal.stock,
                    imagen: item.productoOriginal.imagen,
                    disponible: item.productoOriginal.disponible ?? true,
                    categoria: item.productoOriginal.categorias?.[0] || {
                        id: 1,
                        nombre: "General",
                        descripcion: "Productos generales"
                    }
                }
            };
        });

        // Obtener el historial de pedidos existente para autoincrementar el ID
        const pedidosExistentesJson = localStorage.getItem("pedidos") || '[]';
        const pedidosExistentes: IOrder[] = JSON.parse(pedidosExistentesJson);
        const nuevoId = pedidosExistentes.length > 0 
            ? Math.max(...pedidosExistentes.map(p => p.id)) + 1 
            : 1;

        const { subtotal } = calcularTotales();

        //  Crear el objeto Pedido completo (Estructura JSON)
        const nuevoPedido: IOrder = {
            id: nuevoId,
            fecha: new Date().toISOString().split("T")[0], // Formato "YYYY-MM-DD"
            estado: "PENDIENTE",
            total: subtotal,
            formaPago: selectPayment.value.toUpperCase(),
            detalles: detalles,
            usuarioDto: usuarioDto,
            direccion: inputAddress.value,
            envio: COSTO_ENVIO
        };

        //  Guardar el nuevo pedido en el localStorage (simulando persistencia en backend)
        pedidosExistentes.push(nuevoPedido);
        localStorage.setItem("pedidos", JSON.stringify(pedidosExistentes));

        console.log("¡Pedido Creado con Éxito!", nuevoPedido);
        alert(`¡Gracias por tu compra!\nTu pedido #${nuevoPedido.id} se ha registrado correctamente.`);

        //  Limpiar carrito de la variable y del localStorage
        cart = [];
        localStorage.removeItem("cart");
        
        checkoutForm.reset();
        closeCheckoutModal();
        renderCart();
    });
}

function calcularTotales() {
    const totalProductos = cart.reduce((acc, item) => acc + item.cantidad, 0);
    const subtotal = cart.reduce((acc, item) => acc + (item.cantidad * item.precioUnitario), 0);
    const total = subtotal > 0 ? subtotal + COSTO_ENVIO : 0;

    return { totalProductos, subtotal, total };
}

function renderCart() {
    cartListContainer.innerHTML = "";
    
    const { totalProductos, subtotal, total } = calcularTotales();

    cartBadge.innerText = totalProductos.toString();
    summarySubtotal.innerText = `$${subtotal.toFixed(2)}`;
    summaryEnvio.innerText = subtotal > 0 ? `$${COSTO_ENVIO.toFixed(2)}` : "$0.00";
    summaryTotal.innerText = `$${total.toFixed(2)}`;

    if (cart.length === 0) {
        cartListContainer.innerHTML = `<p style="color: var(--text-gray); margin-top:10px;">No tienes productos en tu carrito.</p>`;
        return;
    }

    cart.forEach(item => {
        const itemTotalCost = item.cantidad * item.precioUnitario;

        const card = document.createElement("div");
        card.className = "cart-item-card";

        card.innerHTML = `
            <div class="item-details">
                <img src="${item.imagenUrl}" alt="${item.nombre}" class="item-img">
                <div class="item-info">
                    <h4>${item.nombre}</h4>
                    <p class="item-desc">${item.descripcion}</p>
                    <p class="item-price-unit">$${item.precioUnitario.toFixed(2)} c/u</p>
                </div>
            </div>
            <div class="item-actions">
                <div class="quantity-controls">
                    <button class="btn-qty" onclick="modificarCantidad(${item.id}, -1)">-</button>
                    <span class="qty-number">${item.cantidad}</span>
                    <button class="btn-qty" onclick="modificarCantidad(${item.id}, 1)">+</button>
                </div>
                <span class="item-total-price">$${itemTotalCost.toFixed(2)}</span>
                <button class="btn-delete-item" onclick="eliminarItem(${item.id})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;

        cartListContainer.appendChild(card);
    });
}

function modificarCantidad(id: number, cambio: number) {
    cart = cart.map(item => {
        if (item.id === id) {
            const nuevaCantidad = item.cantidad + cambio;
            return { ...item, cantidad: nuevaCantidad < 1 ? 1 : nuevaCantidad };
        }
        return item;
    });
    renderCart();
}

function eliminarItem(id: number) {
    cart = cart.filter(item => item.id !== id);
    // Actualizamos también el localStorage si borramos un ítem
    const productosEnCart = cart.map(item => item.productoOriginal);
    localStorage.setItem("cart", JSON.stringify(productosEnCart));
    renderCart();
}

function openCheckoutModal() {
    const { total } = calcularTotales();
    modalTotalAmount.innerText = `$${total.toFixed(2)}`;
    checkoutModal.classList.add("active");
}

function closeCheckoutModal() {
    checkoutModal.classList.remove("active");
}

(window as any).modificarCantidad = modificarCantidad;
(window as any).eliminarItem = eliminarItem;

document.addEventListener("DOMContentLoaded", init);


const inicio_link = document.getElementById("inicio_link") as HTMLLinkElement

const misPedidos = document.getElementById("misPedidos") as HTMLLinkElement

const administracion = document.getElementById("Administracion") as HTMLLinkElement

const logout = document.getElementById("logout") as HTMLLinkElement


administracion?.addEventListener("click", (e) => {
        e.preventDefault();
        const UserJson = localStorage.getItem("userData")

        if (!UserJson) {
        alert("Debes iniciar sesión para acceder aquí.");
        navigate("/src/pages/auth/login/login.html");
        return;
    }
        let user: IUser = JSON.parse(UserJson);

        if(user.role === "admin"){
            navigate("/src/pages/admin/homeAdmin/admin_home.html")
        }else{
            alert("No tienen el rango para acceder aqui")
        }
    });

misPedidos.addEventListener("click", ()=> {
    navigate("/src/pages/store/misPedidos/misPedidos.html")
})

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

    // Guardar cambios
    localStorage.setItem("users", JSON.stringify(users));

    // Eliminar sesión actual
    localStorage.removeItem("userData");

    navigate("/src/pages/auth/login/login.html")
})

inicio_link?.addEventListener("click", () => {
    navigate("/src/pages/store/home/home.html")

})