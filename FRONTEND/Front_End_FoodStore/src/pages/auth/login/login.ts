import type { IUser } from "../../../types/IUser";
import type { Rol } from "../../../types/Rol";
import { navigate } from "../../../utils/navigate";

const form = document.getElementById("form") as HTMLFormElement;
const inputEmail = document.getElementById("email") as HTMLInputElement;
const inputPassword = document.getElementById("password") as HTMLInputElement;
const selectRol = document.getElementById("rol") as HTMLSelectElement;
const btn_register = document.getElementById("btn_back_register") as HTMLButtonElement






async function cargarUsuarios(){

  const usersEnStorage = localStorage.getItem("users");

  // Si ya existen datos guardados (el string existe y no es '[]'), no hace nada más
  if (usersEnStorage && JSON.parse(usersEnStorage).length > 0) {
    return;
  }

  const respuesta = await fetch("/data/usuarios.json")

  if(!respuesta) throw new Error("Error al cargar los usuarios")

  let UsersDefault: IUser[] = await respuesta.json();


  const UsersJsonAdmin = localStorage.getItem("users")
  let Jsonusers: IUser[] = JSON.parse(UsersJsonAdmin || '[]')

  let users: IUser[] = [...UsersDefault, ...Jsonusers]
  localStorage.setItem("users", JSON.stringify(users))
}

cargarUsuarios()


form.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();
  const valueEmail = inputEmail.value;
  const valuePassword = inputPassword.value;
  const valueRol = selectRol.value as Rol;


  const UserJson = localStorage.getItem("users");
  const users: IUser[] = JSON.parse(UserJson || '[]');

  if(users.length === 0){
    alert("No hay usuarios registrados")
    navigate("/src/pages/auth/registro/registro.html")
    return;
  }

  const userFound = users.find(
    (user) => user.email === valueEmail && user.password === valuePassword
  )

  if(!userFound){
    alert("Email o contraseña incorrectos")
    return;
  }

  userFound.loggedIn = true

  localStorage.setItem("userData", JSON.stringify(userFound))

  if (valueRol === "admin") {
    navigate("/src/pages/admin/homeAdmin/admin_home.html");
  } else if (valueRol === "client") {
    navigate("/src/pages/store/home/home.html");
  }
});


btn_register.addEventListener("click", () => {
  navigate("/src/pages/auth/registro/registro.html")
})
