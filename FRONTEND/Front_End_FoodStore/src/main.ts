
import type { IUser } from "./types/IUser";
import { navigate } from "./utils/navigate";


function routerGuard(){
    const userJSON = localStorage.getItem("userData")

    if(!userJSON){
        navigate('/src/pages/auth/login/login.html')
        return;
    }

    const user: IUser = JSON.parse(userJSON);

    const path = window.location.pathname;
     
    if (path.includes("/admin") && user.role !== "admin") {
    navigate("/src/pages/store/home/home.html");
    return;
  }
}

routerGuard()