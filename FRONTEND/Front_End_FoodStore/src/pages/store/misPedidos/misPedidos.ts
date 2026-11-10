import type { IUser } from "../../../types/IUser";
import { navigate } from "../../../utils/navigate";
import type { IOrder } from "../cart/carrito";

let userOrders: IOrder[] = [];

// Elementos del DOM del Modal y Lista
const ordersListContainer = document.getElementById("ordersList") as HTMLDivElement;
const filterStatusSelect = document.getElementById("filterStatus") as HTMLSelectElement;

const orderModal = document.getElementById("orderModal") as HTMLDivElement;
const btnCloseModal = document.getElementById("btnCloseModal") as HTMLButtonElement;
const modalStatusBadge = document.getElementById("modalStatusBadge") as HTMLSpanElement;
const modalDate = document.getElementById("modalDate") as HTMLParagraphElement;

const detailAddress = document.getElementById("detailAddress") as HTMLSpanElement;
const detailPhone = document.getElementById("detailPhone") as HTMLSpanElement;
const detailPayment = document.getElementById("detailPayment") as HTMLSpanElement;
const detailProductsList = document.getElementById("detailProductsList") as HTMLDivElement;

const detailSubtotal = document.getElementById("detailSubtotal") as HTMLSpanElement;
const detailEnvio = document.getElementById("detailEnvio") as HTMLSpanElement;
const detailTotal = document.getElementById("detailTotal") as HTMLSpanElement;

const userNameNav = document.getElementById("userName") as HTMLSpanElement;

function init() {
    loadUserOrders();
    renderOrders();
    setupEventListeners();
}

// 1. Obtener los pedidos filtrados por el usuario logueado
function loadUserOrders() {
    const userJson = localStorage.getItem("userData");
    if (!userJson) {
        navigate("/src/pages/auth/login/login.html");
        return;
    }

    const currentUser = JSON.parse(userJson);
    if (userNameNav) {
        userNameNav.innerText = `${currentUser.nombre} ${currentUser.apellido}`;
    }

    const allOrdersJson = localStorage.getItem("pedidos") || '[]';
    const allOrders: IOrder[] = JSON.parse(allOrdersJson);

    userOrders = allOrders.filter(ord => 
        ord.usuarioDto.mail === currentUser.email || ord.usuarioDto.id === currentUser.id
    );
}

function setupEventListeners() {
    filterStatusSelect?.addEventListener("change", renderOrders);

    btnCloseModal?.addEventListener("click", closeModal);
    orderModal?.addEventListener("click", (e) => {
        if (e.target === orderModal) closeModal();
    });

    // --- NAVEGACIÓN Y LINKS (dentro de setupEventListeners para asegurar que el DOM existe) ---
    const inicio_link = document.getElementById("inicio_link");
    const misPedidos = document.getElementById("misPedidos");
    const logout = document.getElementById("logout");
    const administracion = document.getElementById("Administración");
    const carrito = document.getElementById("carrito");

    inicio_link?.addEventListener("click", (e) => {
        e.preventDefault();
        navigate("/src/pages/store/home/home.html");
    });

    carrito?.addEventListener("click", (e) => {
        e.preventDefault();
        navigate("/src/pages/store/cart/cart.html");
    });

    misPedidos?.addEventListener("click", (e) => {
        e.preventDefault();
        navigate("/src/pages/store/misPedidos/misPedidos.html");
    });

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

    logout?.addEventListener("click", (e) => {
        e.preventDefault();
        const UserJson = localStorage.getItem("userData");
        if (UserJson) {
            const userActual = JSON.parse(UserJson);
            const UsersJson = localStorage.getItem("users") || '[]';
            const users: IUser[] = JSON.parse(UsersJson);

            const updatedUsers = users.map((u: any) => {
                if (u.email === userActual.email) {
                    return { ...u, loggedIn: false };
                }
                return u;
            });

            localStorage.setItem("users", JSON.stringify(updatedUsers));
            localStorage.removeItem("userData");
        }

        navigate("/src/pages/auth/login/login.html");
    });
}

// 2. Renderizar la lista de tarjetas
function renderOrders() {
    if (!ordersListContainer) return;
    ordersListContainer.innerHTML = "";
    const filterValue = filterStatusSelect?.value || "todos";

    const filtered = userOrders.filter(ord => {
        if (filterValue === "todos") return true;
        return ord.estado === filterValue;
    });

    if (filtered.length === 0) {
        ordersListContainer.innerHTML = `<p style="text-align:center; color:#888; margin-top:30px;">No tienes pedidos registrados en este estado.</p>`;
        return;
    }

    filtered.forEach(order => {
        const totalProductos = order.detalles.reduce((acc, d) => acc + d.cantidad, 0);
        const costoEnvio = order.envio ?? 500;
        const totalFinal = order.total + costoEnvio;

        const productosNombres = order.detalles.map(d => `${d.producto.nombre} (x${d.cantidad})`).join(", ");

        const card = document.createElement("div");
        card.className = "order-card";
        card.addEventListener("click", () => openOrderDetail(order));

        card.innerHTML = `
            <div class="card-header">
                <h4 class="card-title">Pedido #ORD-${order.id}</h4>
                <span class="badge-status ${order.estado.toLowerCase()}">${order.estado}</span>
            </div>
            <p class="card-date">📅 ${order.fecha}</p>
            <p class="card-products-preview">• ${productosNombres}</p>
            <div class="card-footer">
                <span>📦 ${totalProductos} producto(s)</span>
                <span class="card-price">$${totalFinal.toFixed(2)}</span>
            </div>
        `;

        ordersListContainer.appendChild(card);
    });
}

// 3. Abrir Modal de Detalle
function openOrderDetail(order: IOrder) {
    if (modalStatusBadge) {
        modalStatusBadge.innerText = order.estado;
        modalStatusBadge.className = `badge-status ${order.estado.toLowerCase()}`;
    }
    if (modalDate) modalDate.innerText = `📅 ${order.fecha}`;

    if (detailAddress) detailAddress.innerText = order.direccion || "Retiro en sucursal";
    if (detailPhone) detailPhone.innerText = order.usuarioDto.celular;
    if (detailPayment) detailPayment.innerText = order.formaPago;

    if (detailProductsList) {
        detailProductsList.innerHTML = "";
        order.detalles.forEach(item => {
            const row = document.createElement("div");
            row.className = "product-row";
            row.innerHTML = `
                <div>
                    <strong>${item.producto.nombre}</strong><br>
                    <small style="color:#777;">Cantidad: ${item.cantidad} x $${item.producto.precio}</small>
                </div>
                <div><strong>$${item.subtotal.toFixed(2)}</strong></div>
            `;
            detailProductsList.appendChild(row);
        });
    }

    const envio = order.envio ?? 500;
    if (detailSubtotal) detailSubtotal.innerText = `$${order.total.toFixed(2)}`;
    if (detailEnvio) detailEnvio.innerText = `$${envio.toFixed(2)}`;
    if (detailTotal) detailTotal.innerText = `$${(order.total + envio).toFixed(2)}`;

    orderModal?.classList.add("active");
}

function closeModal() {
    orderModal?.classList.remove("active");
}

document.addEventListener("DOMContentLoaded", init);