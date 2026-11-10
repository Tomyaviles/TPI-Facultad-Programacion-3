import type { ICategory } from "../../../types/ICategory";
import { navigate } from "../../../utils/navigate";
import type { IUser } from "../../../types/IUser";


// Datos de ejemplo iniciales que cumplen estrictamente con la interfaz ICategory
let categories: ICategory[];

// Elementos del DOM
const tableBody = document.getElementById("categoriesTableBody") as HTMLTableSectionElement;
const btnNuevaCategoria = document.getElementById("btnNuevaCategoria") as HTMLButtonElement;
const categoryModal = document.getElementById("categoryModal") as HTMLDivElement;
const btnCloseModal = document.getElementById("btnCloseModal") as HTMLButtonElement;
const categoryForm = document.getElementById("categoryForm") as HTMLFormElement;

const modalTitle = document.getElementById("modalTitle") as HTMLHeadingElement;
const categoryIdInput = document.getElementById("categoryId") as HTMLInputElement;
const categoryNameInput = document.getElementById("categoryName") as HTMLInputElement;
const categoryDescriptionInput = document.getElementById("categoryDescription") as HTMLTextAreaElement;

// Inicializador de eventos
async function init() {
    try{
    const response = await fetch("/data/categorias.json")
    if(!response) throw new Error("Error al cargar las categorias en panel de admin");

    categories = await response.json();
    }catch(error){
     console.error("No se pudieron cargar las categorias:", error);
    }
    
    renderTable();
    setupEventListeners();
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
    const activeCategories = categories.filter(cat => !cat.eliminado);
    
    activeCategories.forEach(category => {
        const row = document.createElement("tr");
        
        // Dado que la interfaz 'ICategory' provista no incluye imagen, utilizamos una imagen por defecto 
        // para que la vista coincida de manera estética con el panel de Food Store.
        row.innerHTML = `
            <td>${category.id}</td>
            <td>
                <img class="category-img" src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&auto=format&fit=crop" alt="${category.nombre}">
            </td>
            <td><strong>${category.nombre}</strong></td>
            <td>${category.descripcion}</td>
            <td>
                <button class="btn-action-edit" onclick="editCategory(${category.id})">Editar</button>
                <button class="btn-action-delete" onclick="deleteCategory(${category.id})">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Abre el modal de creación o edición
function openModal(category?: ICategory) {
    categoryModal.classList.add("active");
    if (category) {
        modalTitle.innerText = "Editar Categoría";
        categoryIdInput.value = category.id.toString();
        categoryNameInput.value = category.nombre;
        categoryDescriptionInput.value = category.descripcion;
    } else {
        modalTitle.innerText = "Nueva Categoría";
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
    const nombre = categoryNameInput.value.trim();
    const descripcion = categoryDescriptionInput.value.trim();

    if (!nombre || !descripcion) return;

    if (idVal) {
        // Edición (Update)
        const id = parseInt(idVal);
        categories = categories.map(cat => {
            if (cat.id === id) {
                return { 
                    ...cat, 
                    nombre, 
                    descripcion 
                };
            }
            return cat;
        });
    } else {
        // Creación (Create)
        const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
        const newCategory: ICategory = {
            id: newId,
            eliminado: false,
            nombre,
            descripcion
        };
        categories.push(newCategory);
    }

    renderTable();
    closeModal();
}

// Eliminado lógico (Soft Delete) cambiando el estado de "eliminado" a true
function deleteCategory(id: number) {
    if (confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
        categories = categories.map(cat => {
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
    const category = categories.find(cat => cat.id === id);
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
