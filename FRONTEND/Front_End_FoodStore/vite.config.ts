import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        //d:aplicaion/dist/
        index: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "src/pages/auth/login/login.html"),
        registro: resolve(__dirname, "src/pages/auth/registro/registro.html"),
        adminHome: resolve(__dirname, "src/pages/admin/homeAdmin/admin_home.html"),
        storeHome: resolve(__dirname, "src/pages/store/home/home.html"),
        cartHome: resolve(__dirname, "src/pages/store/cart/cart.html"),
        categoria: resolve(__dirname, "/src/pages/admin/categorias/categoria.html"),
        pedido: resolve(__dirname, "/src/pages/admin/pedidos/pedido.html"),
        producto: resolve(__dirname, "/src/pages/admin/productos/producto.html")
      },
    },
  },
  base: "./",
});
