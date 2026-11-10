import { checkAuhtUser } from "../../../utils/auth";

import { PRODUCTS } from "../../../../public/data/data";
import type { Product } from "../../../types/Product";
import { navigate } from "../../../utils/navigate";
import type { IUser } from "../../../types/IUser";
import type { ICategory } from "../../../types/ICategory";

/*
const buttonLogout = document.getElementById(
  "logoutButton"
) as HTMLButtonElement;
buttonLogout?.addEventListener("click", () => {
  logout();
});

*/


const cartLink = document.getElementById("carrito_link") as HTMLLinkElement


const form = document.getElementById("form_buscar") as HTMLFormElement

let carrito: Product[] = [];
const initPage = () => {
  console.log("inicio de pagina");
  checkAuhtUser(
    "/src/pages/auth/login/login.html",
    "/src/pages/admin/home/home.html",
    "client"
  );
};
initPage();




///////LOG OUT BUTTON /////////

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


////// CATEGORIAS ////////


async function cargarCategorias() {
    const lista = document.getElementById("lista-categorias") as HTMLUListElement
    lista.innerHTML = "";

    
    try{

        const respuesta = await fetch("/data/categorias.json");

        if(!respuesta) throw new Error("Error al obtener los productos");

        const categorias: ICategory[] = await respuesta.json();

        categorias.forEach(categoria => {
            const li = document.createElement("li") as HTMLLIElement
            const a = document.createElement("a") as HTMLElement
            li.className = "list_element"

            a.textContent = categoria.nombre
            
            li.appendChild(a)
            lista.appendChild(li)



        a.addEventListener("click", () => {

        ///Buscamos los productos por su categoria
        const productos_buscados = PRODUCTS.filter(P =>
            P.categorias.some(cat => cat.nombre === categoria.nombre)
        )

        console.log(productos_buscados[0].nombre)

        const catalogo = document.getElementById("contenedor-productos") as HTMLElement;
        catalogo.innerHTML = "";


        productos_buscados.forEach(producto_buscado => {

        const article = document.createElement("article")
        article.classList.add("products_article")

        article.innerHTML = `
            <img src="${producto_buscado.imagen}" alt="${producto_buscado.nombre}" class="product_image">
            <h3 class="product_title">${producto_buscado.nombre}</h3>
            <p class="product_description">${producto_buscado.descripcion}</p>
            <p class="product_precio">${producto_buscado.precio}</p>
            <button type="button" class="product_button">Agregar</button>
        `
        const boton = article.querySelector("button") as HTMLButtonElement

        
        boton.addEventListener("click", ()=> {
            alert("Agregaste: " + producto_buscado.nombre);
            const carritoJson = localStorage.getItem("cart") || '[]';
            carrito = JSON.parse(carritoJson);
            carrito.push(producto_buscado)
            localStorage.setItem("cart", JSON.stringify(carrito))
            })
        catalogo.appendChild(article);
        })

        })






        })    
}catch(error){

}

    
    
}


form.addEventListener("submit", (e) => {
    e.preventDefault()

    const input_value = document.getElementById("buscar_input") as HTMLInputElement
    const nombre_producto = String(input_value.value)

    const productos_buscados = PRODUCTS.filter(p =>
         p.nombre.toLowerCase().includes(nombre_producto.toLowerCase()))

    if(productos_buscados.length == 0){
        alert("Producto no encontrado!")
        return;
    }

    const catalogo = document.getElementById("contenedor-productos") as HTMLElement;
    catalogo.innerHTML = "";
    
    

    productos_buscados.forEach(producto_buscado => {

        const article = document.createElement("article")
        article.classList.add("products_article")

        article.innerHTML = `
        <img src="${producto_buscado.imagen}" alt="${producto_buscado.nombre}" class="product_image">
            <h3 class="product_title">${producto_buscado.nombre}</h3>
            <p class="product_description">${producto_buscado.descripcion}</p>
            <p class="product_precio">${producto_buscado.precio}</p>
            <button type="button" class="product_button">Agregar</button>
    `

    const boton = article.querySelector("button") as HTMLButtonElement

        boton.addEventListener("click", ()=> {
            alert("Agregaste: " + producto_buscado.nombre);
            const carritoJson = localStorage.getItem("cart") || '[]';
            carrito = JSON.parse(carritoJson);
            carrito.push(producto_buscado)
            localStorage.setItem("cart", JSON.stringify(carrito))
        })

         catalogo.appendChild(article);

    })
    
   

})



async function cargarProducto(){
    const catalogo = document.getElementById("contenedor-productos") as HTMLElement;
    catalogo.innerHTML = "";

    try{
            const respuesta = await fetch("/data/productos.json");

            if (!respuesta.ok) throw new Error("Error al obtener los productos");

            const productos: Product[] = await respuesta.json();

        productos.forEach(producto => {

            const article = document.createElement("article");
            article.classList.add("products_article");

            article.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.nombre}" class="product_image">
                <h3 class="product_title">${producto.nombre}</h3>
                <p class="product_description">${producto.descripcion}</p>
                <p class="product_precio">${producto.precio}</p>
                <button type="button" class="product_button">Agregar</button>
            `;

            const boton = article.querySelector("button") as HTMLButtonElement

            boton.addEventListener("click", ()=> {
                alert("Agregaste: " + producto.nombre);
                const carritoJson = localStorage.getItem("cart") || '[]';
                carrito = JSON.parse(carritoJson);
                carrito.push(producto)
                localStorage.setItem("cart", JSON.stringify(carrito))
            })


            catalogo.appendChild(article);
        })
    }catch(error){
        console.error("No se pudieron cargar los productos:", error);
        catalogo.innerHTML = "<p>Hubo un error al cargar el menú. Intenta más tarde.</p>";
    }

}


cartLink.addEventListener("click", () => {
    navigate("/src/pages/store/cart/cart.html")
})

cargarProducto()
cargarCategorias()
