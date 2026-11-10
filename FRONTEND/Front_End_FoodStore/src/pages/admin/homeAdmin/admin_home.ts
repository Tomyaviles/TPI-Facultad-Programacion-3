import type { IUser } from "../../../types/IUser";
import { checkAuhtUser } from "../../../utils/auth";
import { navigate } from "../../../utils/navigate";



const initPage = () => {
  console.log("inicio de pagina");
  checkAuhtUser(
    "/src/pages/auth/login/login.html",
    "/src/pages/client/home/home.html",
    "admin"
  );
};
initPage();


const categoria_link = document.getElementById("categoria_link")

const producto_link = document.getElementById("producto_link")

const pedido_link = document.getElementById("pedido_link")


const btnProduct = document.getElementById("producto_btn") as HTMLButtonElement

const btnCategoria = document.getElementById("categoria_btn") as HTMLButtonElement

const btnPedido = document.getElementById("pedido_btn") as HTMLButtonElement


btnPedido.addEventListener("click", () => {
  navigate("/src/pages/admin/pedidos/pedido.html")
})


btnCategoria.addEventListener("click", () => {
  navigate("/src/pages/admin/categorias/categoria.html")

})


btnProduct.addEventListener("click", () => {
  navigate("/src/pages/admin/productos/producto.html")

})


pedido_link?.addEventListener("click", () => {
    navigate("/src/pages/admin/pedidos/pedido.html")
})


producto_link?.addEventListener("click", () => {
  navigate("/src/pages/admin/productos/producto.html")
})

categoria_link?.addEventListener("click", () => {
  navigate("/src/pages/admin/categorias/categoria.html")
})


const logout = document.getElementById("logout") as HTMLButtonElement | null;

logout?.addEventListener("click", (e) => {
    e.preventDefault(); // Evita recargas inesperadas de la página

    const UserJson = localStorage.getItem("userData");
    if (!UserJson) return;

    const userActual = JSON.parse(UserJson);

    const UsersJson = localStorage.getItem("users") || '[]';
    const users: IUser[] = JSON.parse(UsersJson);

    // 1. Guardamos el resultado del .map() en una nueva variable
    const updatedUsers = users.map((u: any) => {
        if (u.email === userActual.email) {
            return { ...u, loggedIn: false };
        }
        return u;
    });

    // 2. Guardamos la variable actualizada en el localStorage
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // 3. Eliminamos la sesión activa
    localStorage.removeItem("userData");

    // 4. Redirigimos al login
    navigate("/src/pages/auth/login/login.html");
});