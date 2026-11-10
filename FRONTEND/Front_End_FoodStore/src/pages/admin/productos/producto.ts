

import { navigate } from "../../../utils/navigate";
import type { Product } from "../../../types/Product";
import type { IUser } from "../../../types/IUser";


// Datos de ejemplo iniciales que cumplen estrictamente con la interfaz ICategory
let productos: Product[] = []


// Elementos del DOM
const tableBody = document.getElementById("productosTableBody") as HTMLTableSectionElement;
const btnNuevaCategoria = document.getElementById("btnNuevaCategoria") as HTMLButtonElement;
const categoryModal = document.getElementById("categoryModal") as HTMLDivElement;
const btnCloseModal = document.getElementById("btnCloseModal") as HTMLButtonElement;
const categoryForm = document.getElementById("categoryForm") as HTMLFormElement;

const modalTitle = document.getElementById("modalTitle") as HTMLHeadingElement;
const categoryIdInput = document.getElementById("categoryId") as HTMLInputElement;
const productNameInput = document.getElementById("productName") as HTMLInputElement;
const categoryDescriptionInput = document.getElementById("categoryDescription") as HTMLTextAreaElement;

// Inicializador de eventos
async function init() {
    await fetchProductos();
    setupEventListeners();
    renderTable();
   
    
}

async function fetchProductos() {

    try{
    const response = await fetch("/data/productos.json");
    if(!response) throw new Error("Los productos del panel de admin no se cargaron correctamente");

    productos = await response.json();
    }catch(error){
    console.error("No se pudieron cargar los productos:", error);
    }
    
}

// Configuración de los listeners
function setupEventListeners() {
    btnNuevaCategoria.addEventListener("click", () => {
        openModal();
    });

    btnCloseModal.addEventListener("click", () => {
        closeModal();
    });

    categoryModal.addEventListener("click", (e) => {
        if (e.target === categoryModal) {
            closeModal();
        }
    });

    categoryForm.addEventListener("submit", (e) => {
        e.preventDefault();
        saveCategory();
    });
}

// Renderiza la tabla de categorías en el DOM
function renderTable() {
    tableBody.innerHTML = "";
    
    // Filtramos para no mostrar las categorías marcadas como "eliminado: true" (Soft Delete lógico)
    const activeProductos = productos.filter(prod => !prod.eliminado);
    
    activeProductos.forEach(product => {
        const row = document.createElement("tr");
        
        // Dado que la interfaz 'ICategory' provista no incluye imagen, utilizamos una imagen por defecto 
        // para que la vista coincida de manera estética con el panel de Food Store.
        row.innerHTML = `
            <td>${product.id}</td>
            <td>
                <img class="category-img" src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&auto=format&fit=crop" alt="${product.nombre}">
            </td>
            <td><strong>${product.nombre}</strong></td>
            <td>${product.descripcion}</td>
            <td>${product.precio}</td>
            <td>${product.stock}</td>
            <td>
                <button class="btn-action-edit" onclick="editCategory(${product.id})">Editar</button>
                <button class="btn-action-delete" onclick="deleteCategory(${product.id})">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Abre el modal de creación o edición
function openModal(product?: Product) {
    categoryModal.classList.add("active");
    if (product) {
        modalTitle.innerText = "Editar Producto";
        categoryIdInput.value = product.id.toString();
        productNameInput.value = product.nombre;
        categoryDescriptionInput.value = product.descripcion;
    } else {
        modalTitle.innerText = "Nuevo Producto";
        categoryForm.reset();
        categoryIdInput.value = "";
    }
}

// Cierra la ventana emergente
function closeModal() {
    categoryModal.classList.remove("active");
    categoryForm.reset();
    categoryIdInput.value = "";
}

// Guarda (Crea o Edita) la categoría respetando la estructura de la interfaz
function saveCategory() {
    const idVal = categoryIdInput.value;
    const nombre = productNameInput.value.trim();
    const descripcion = categoryDescriptionInput.value.trim();

    if (!nombre || !descripcion) return;

    if (idVal) {
        // Edición (Update)
        const id = parseInt(idVal);
        productos = productos.map(prod => {
            if (prod.id === id) {
                return { 
                    ...prod, 
                    nombre, 
                    descripcion 
                };
            }
            return prod;
        });
    } else {
        // Creación (Create)
        const newId = productos.length > 0 ? Math.max(...productos.map(c => c.id)) + 1 : 1;
        const newProducto: Product = {
            id: newId,
            eliminado: false,
            createdAt: new Date().toISOString(),
            nombre,
            descripcion,
            precio: 0,
            stock: 0,
            imagen: "",
            disponible: false,
            categorias: []
        };
        productos.push(newProducto);
    }

    renderTable();
    closeModal();
}

// Eliminado lógico (Soft Delete) cambiando el estado de "eliminado" a true
function deleteCategory(id: number) {
    if (confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
        productos = productos.map(cat => {
            if (cat.id === id) {
                return { ...cat, eliminado: true };
            }
            return cat;
        });
        renderTable();
    }
}

// Busca la categoría y carga sus datos en la ventana emergente
function editCategory(id: number) {
    const category = productos.find(cat => cat.id === id);
    if (category) {
        openModal(category);
    }
}

// Exposición al entorno global (window) para que el HTML pueda llamar a los onclick inline
(window as any).editCategory = editCategory;
(window as any).deleteCategory = deleteCategory;

// Inicialización del script
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
