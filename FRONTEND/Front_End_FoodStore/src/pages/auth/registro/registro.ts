import type { IUser } from "../../../types/IUser"
import type { Rol } from "../../../types/Rol"
import { navigate } from "../../../utils/navigate"


const form = document.getElementById("form_register") as HTMLFormElement



const btnLogin = document.getElementById("btn_back_login") as HTMLButtonElement

//CAGAR LOS DATOS DE LOS USUARIOS Y GUARDALOS EN LOCAL STORAGE
// NO PERMITIR REPETIDOS


form.addEventListener("submit", (e) =>{
    e.preventDefault()

    const valueEmail = document.getElementById("email") as HTMLInputElement
    const valuePassword = document.getElementById("password") as HTMLInputElement
    const rol: Rol = "client"


    const newUser: IUser = {
        email : String(valueEmail.value),
        password: String(valuePassword.value),
        loggedIn: false,
        role : rol
    }

    const email = valueEmail.value

    const UsersJson = localStorage.getItem("users")
    let users: IUser[] = [];

    if(UsersJson){
        users = JSON.parse(UsersJson)
    }

    const existente = users.some(user => user.email === email)

    if(existente){
        alert("El usuario que quieres registrar, YA EXISTE")
        return;
    }

    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))

    form.reset()
    


})


btnLogin.addEventListener("click", ()=> {

    navigate("/src/pages/auth/login/login.html")
})