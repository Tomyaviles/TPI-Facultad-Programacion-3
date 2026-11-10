package com.tp.jpa;

import com.tp.jpa.Model.*;
import com.tp.jpa.Model.Enums.Estado;
import com.tp.jpa.Model.Enums.FormaPago;
import com.tp.jpa.Model.Enums.Rol;
import com.tp.jpa.Repository.CategoriaRepository;
import com.tp.jpa.Repository.PedidoRepository;
import com.tp.jpa.Repository.ProductoRepository;
import com.tp.jpa.Repository.UsuarioRepository;
import com.tp.jpa.Utils.JpaUtils;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;
import jakarta.persistence.criteria.CriteriaBuilder;

import javax.sound.sampled.Port;
import java.time.LocalDate;
import java.util.*;

//TIP To <b>Run</b> code, press <shortcut actionId="Run"/> or
// click the <icon src="AllIcons.Actions.Execute"/> icon in the gutter.
public class Main {
    private static final Scanner sc = new Scanner(System.in);
    private static final CategoriaRepository categoriaRepository = new CategoriaRepository();
    private static final ProductoRepository productoRepository = new ProductoRepository();

    private static final UsuarioRepository usuarioRepository = new UsuarioRepository();
    private static final PedidoRepository pedidoRepository = new PedidoRepository();
    public static void main(String[] args) {

        boolean salir = false;
        int opcion = 0;
        do {
            MenuPrincipal();
            System.out.println("Elija una opcion: ");
            opcion = sc.nextInt();
            sc.nextLine();
            switch (opcion)
            {
                case 1:
                    MenuCategoria();
                    break;
                case 2: MenuProductos();
                    break;
                case 3:MenuUsuarios();
                    break;
                case 4: MenuPedidos();
                    break;
                case 5: MenuReportes();
                    break;
                case 0:
                    JpaUtils.close();
                    salir = true;
                break;


            }
        }   while(!salir);


    }


    /// ///// MENUS////////////////////
    public static void MenuPrincipal(){
        System.out.println("////////////////////");
        System.out.println("///MENU PRINCIPAL///");
        System.out.println("1. Categoria");
        System.out.println("2. Producto");
        System.out.println("3. Usuario");
        System.out.println("4. Pedidos");
        System.out.println("5. Reportes");
        System.out.println("0. Salir");
    }


    public static void MenuOpciones(){
        System.out.println("1. Alta");
        System.out.println("2. Baja");
        System.out.println("3. Modificacion");
        System.out.println("4. Listado");
        System.out.println("0. Salir");

    }

    public static void MenuCategoria(){
        System.out.println("//////////////////////");
        System.out.println("/////CATEGORIA////////\n");
        boolean salir = false;
        do{
            MenuOpciones();
            System.out.println("Elija una opcion: ");
            Integer opcion = Integer.parseInt(sc.nextLine());

            switch (opcion){
                case 1:altaCategoria();break;
                case 2:bajaCategoria();break;
                case 3:modificarCategoria();break;
                case 4:listarCategoria();break;
                case 0: salir = true; break;
            }
        } while(!salir);
    }

    public static void MenuReportes(){
        System.out.println("//////////////////////");
        System.out.println("/////Reportes////////\n");
        boolean salir = false;

        do {
            System.out.println("1.Productos x Categoria");
            System.out.println("2. Pedidos x Estado");
            System.out.println("3. Pedidos x Usuario");
            System.out.println("4. Total Facturado");
            System.out.println("0. salir");
            System.out.println("Ingrese su opcion: ");
            Integer opcion = Integer.parseInt(sc.nextLine());

            switch (opcion){
                case 1: ProductoXCategoria(); break;
                case 2: PedidoXEstado(); break;
                case 3: PedidosXUsuario(); break;
                case 4: calcularTotal(); break;
                case 0: salir = true; break;
            }
        }while (!salir);
    }


    public static void MenuProductos(){
        System.out.println("//////////////////////");
        System.out.println("/////Productos////////\n");

        boolean salir = false;

       do {
           MenuOpciones();
           System.out.println("Elija una opcion: ");
           Integer opcion = Integer.parseInt(sc.nextLine());

            switch (opcion){
                case 1: altaProducto(); break;
                case 2: bajaProducto();break;
                case 3: modificarProducto();break;
                case 4: listarProductos();break;
                case 0: salir = true;break;
            }

        } while (!salir);

    }

    public static void MenuUsuarios(){
        System.out.println("//////////////////////////");
        System.out.println("///////Usuarios//////////\n");
        boolean salir = false;
        do{
            System.out.println("1. Alta");
            System.out.println("2. Baja");
            System.out.println("3. Modificacion");
            System.out.println("4. Listado");
            System.out.println("5. Buscar x email");
            System.out.println("0. Salir");
            System.out.println("Elija una opcion: ");
            Integer opcion = Integer.parseInt(sc.nextLine());

            switch (opcion){
                case 1: altaUsuario();break;
                case 2: bajaUsuario(); break;
                case 3: ModificarUsuario();break;
                case 4: listarUsuarios(); break;
                case 5: BuscarPorMail();break;
                case 0: salir = true; break;
            }

        }while(!salir);
    }

    public static void MenuPedidos(){

        System.out.println("//////////////////////////");
        System.out.println("///////Pedidos//////////\n");
        boolean salir = false;
        do{
            System.out.println("1. Alta");
            System.out.println("2. Baja");
            System.out.println("3. Modificar estado");
            System.out.println("4. Listado");
            System.out.println("0. Salir");
            System.out.println("Elija una opcion: ");
            Integer opcion = Integer.parseInt(sc.nextLine());

            switch (opcion){
                case 1: altaPedido();break;
                case 2: bajaPedido(); break;
                case 3: modificarEstado(); break;
                case 4: listarPedidos(); break;
                case 0: salir = true; break;
            }

        }while(!salir);


    }




                /// ///FUNCIONES CATEGORIA////////

    public static void altaCategoria(){

        System.out.println("Ingrese el Nombre de su categoria: ");
        String nombreCategoria = sc.nextLine();
        System.out.println("Ingrese la Descripcion de su categoria: ");
        String descripcion = sc.nextLine();

        Categoria categoria=  Categoria.builder()
                .nombre(nombreCategoria)
                .descripcion(descripcion)
                .build();
        Categoria categoriaGuardada = categoriaRepository.guardar(categoria);

        System.out.println("Categoria guardada con Id: " + categoriaGuardada.getId());
    }
    public static void bajaCategoria() {
        System.out.println("Ingrese el Id a eliminar: ");
        Long id_buscar = Long.parseLong(sc.nextLine());
        Optional<Categoria> categoriaBuscada = categoriaRepository.buscarPorId(id_buscar);
        if (categoriaBuscada.isEmpty() || categoriaBuscada.get().isEliminado()){
            System.out.println("No existe una categoria creada o activa con ese id: " + id_buscar);
            return;
        }
        categoriaRepository.eliminadoLogico(id_buscar);
        System.out.println("La categoria " + id_buscar + " de nombre: " + categoriaBuscada.get().getNombre() + " ah sido daba de baja");
    }

    public static void modificarCategoria(){
        System.out.println("Ingrese el Id a modificar");
        Long id_modificar = sc.nextLong();

        Optional<Categoria> categoriaModificar = categoriaRepository.buscarPorId(id_modificar);
        if(categoriaModificar.isEmpty()){
            System.out.println("No existe una categoria creada con ese id: " + id_modificar);
            return;
        }

        System.out.println("Id: " + categoriaModificar.get().getId());
        System.out.println("Nombre: "+ categoriaModificar.get().getNombre());
        System.out.println("Descripcion: " + categoriaModificar.get().getDescripcion());
        System.out.println("eliminado: " +categoriaModificar.get().isEliminado());

        System.out.println("////////////////////////////");
        System.out.println("Ingrese el nuevo nombre: ");
        String nombreNuevo = sc.next();
        System.out.println("Ingrese la nueva descripcion: ");
        String nuevaDescripcion = sc.next();

        System.out.println("Esta eliminado? 1: si, 2: no");
        Integer eliminado = sc.nextInt();

        categoriaModificar.get().setNombre(nombreNuevo);
        categoriaModificar.get().setDescripcion(nuevaDescripcion);
        if (eliminado == 1){
            categoriaModificar.get().setEliminado(true);
        }else{
            categoriaModificar.get().setEliminado(false);
        }

        categoriaRepository.guardar(categoriaModificar.get());
    }


    public static void listarCategoria(){
        List<Categoria> categoriaList = categoriaRepository.listarActivos();
        if(categoriaList.isEmpty()){
            System.out.println("No hay activos en la lista");
            return;
        }
        categoriaList.forEach(c -> {
            System.out.println("ID: " + c.getId());
            System.out.println("Nombre: " + c.getNombre());
            System.out.println("Descripción: " + c.getDescripcion());
            System.out.println("---------------------");
    });
    }



    //////////////USUARIOS/////////////////////////////

    public static void altaUsuario(){
        boolean emailExistente = true;
        String nombreUsuario = "";
        String apellidoUsuario = "";
        String email = "";

        do {


            System.out.println("Ingrese el nombre de su usuario: ");
            nombreUsuario = sc.nextLine();
            System.out.println("Ingrese el apellido de su usuario: ");
            apellidoUsuario = sc.nextLine();
            System.out.println("Ingrese el email de su usuario: ");
            email = sc.nextLine();
           Optional<Usuario> check = usuarioRepository.buscarPorMail(email);

            if (check.isPresent()){
                System.out.println("Este email ya existe\n");
                emailExistente = false;
            }else {
                emailExistente = true;
            }
        }while(!emailExistente);
        System.out.println("Ingrese su password: ");
        String password = sc.nextLine();
        System.out.println("Ingrese su telefono: ");
        String telefono = sc.nextLine();
        System.out.println("Elija el rol: ");
        System.out.println("1. USER");
        System.out.println("2. ADMIN");
        System.out.println("Opcion: ");
        Integer opcion = Integer.parseInt(sc.nextLine());

        Rol rol;
        if(opcion == 1){
            rol = Rol.USER;
        }else {
            rol = Rol.ADMIN;
        }

        Usuario usuario = Usuario.builder()
                .nombre(nombreUsuario)
                .apellido(apellidoUsuario)
                .mail(email)
                .contrasena(password)
                .celular(telefono)
                .rol(rol)
                .build();

        Usuario usuariooGuardado = usuarioRepository.guardar(usuario);

        if(usuariooGuardado != null){
            System.out.println("Usuario guardado! nombre: " + usuariooGuardado.getNombre() + " id: " + usuariooGuardado.getId());
        }

    }


    public static void bajaUsuario(){
        System.out.println("Ingrese el id a buscar: ");
        Long id_buscar = Long.parseLong(sc.nextLine());
        Optional<Usuario> usuarioBuscado = usuarioRepository.buscarPorId(id_buscar);
        if(usuarioBuscado.isEmpty() || usuarioBuscado.get().isEliminado()){
            System.out.println("El usuario no existe o no se encuentra activo");
            return;
        }
        usuarioRepository.eliminadoLogico(id_buscar);
        System.out.println("Usuario: " + usuarioBuscado.get().getNombre() + " Id: " + usuarioBuscado.get().getId() + " fue eliminado");

    }



    public static void listarUsuarios(){
        List<Usuario> listaUsuario = usuarioRepository.listarActivos();
        if (listaUsuario.size() == 0){
            System.out.println("No hay usuarios disponibles");
        }
        listaUsuario.forEach(u -> {
            System.out.println("Id: " + u.getId());
            System.out.println("Nombre: " + u.getNombre());
            System.out.println("Apellido: "+ u.getApellido());
            System.out.println("Email: "+ u.getMail());
            System.out.println("Telefono: "+ u.getCelular());
            System.out.println("--------------------------------");
        });
    }


    public static void ModificarUsuario(){
        listarUsuarios();
        System.out.println("Ingrese el id del usuario a modificar: ");
        Long id_buscado = Long.parseLong(sc.nextLine());

        Optional<Usuario> usuario = usuarioRepository.buscarPorId(id_buscado);
        System.out.println("Ingrese el nuevo nombre: ");
        String nombre = sc.nextLine();
        System.out.println("Ingrese el nuevo apellido: ");
        String apellido = sc.nextLine();
        System.out.println("Ingrese el nuevo email: ");
        String email = sc.nextLine();
        System.out.println("Ingrese la nueva contraseña: ");
        String password = sc.nextLine();
        System.out.println("Ingrese el nuevo telefono: ");
        String celular = sc.nextLine();

        usuario.get().setNombre(nombre);
        usuario.get().setApellido(apellido);
        usuario.get().setMail(email);
        usuario.get().setCelular(celular);
        usuario.get().setContrasena(password);

        usuarioRepository.guardar(usuario.get());
    }


    public static void BuscarPorMail(){
        System.out.println("Ingrese el email a buscar: ");
        String email = sc.nextLine();

        Optional<Usuario> usuario = usuarioRepository.buscarPorMail(email);

        if (usuario.isEmpty() || usuario.get().isEliminado()){
            System.out.println("El usuario no existe o no esta activo");
        }

        System.out.println("////////Usuario: ////////////");
        System.out.println("Nombre: " + usuario.get().getNombre());
        System.out.println("Apellido: " + usuario.get().getApellido());
        System.out.println("Email: " + usuario.get().getMail());
        System.out.println("Telefono: " + usuario.get().getCelular());
        System.out.println("/////////////////////////////");

    }










    /// /////////PEDIDO/////////////////////////////////////////////////





    public static void altaPedido(){



        /// SELECCION DE USUARIO
        System.out.println("////Usuarios Activos/////////");
        List<Usuario> usuarios = usuarioRepository.listarActivos();
        for (Usuario u : usuarios){
            System.out.println("//////////////////");
            System.out.println("ID: " + u.getId() + " Nombre: " + u.getNombre()+ " " + u.getApellido() +  " email: " + u.getMail());
            System.out.println("//////////////////");
        }
        System.out.println("Seleccione uno por id: ");
        Long id_elegido = Long.parseLong(sc.nextLine());

        Optional<Usuario> usuario = usuarioRepository.buscarPorId(id_elegido);

        System.out.println("Usuario elegido: " + usuario.get().getNombre());


        /// ELEGIR FORMA DE PAGO

        System.out.println("Fommas de pago: ");
        System.out.println("1. Tarjeta");
        System.out.println("2. Efectivo");
        System.out.println("3. Transferencia");
        System.out.println("Seleccione una forma de pago: ");
        Integer opcion = Integer.parseInt(sc.nextLine());
        FormaPago formaPago;
        switch (opcion){
            case 1: formaPago = FormaPago.TARJETA;break;
            case 2: formaPago = FormaPago.EFECTIVO; break;
            case 3: formaPago = FormaPago.TRANSFERENCIA; break;
            default: formaPago = null; break;
        }

        System.out.println("Forma Pago elegida: " + formaPago.name());

        List<Producto> productos = productoRepository.listarActivos();
        Map<Producto, Integer> lista_temporal = new HashMap<>();



        /// ////////ELEGIR PRODUCTO/////////////
        int seguir = 0;

        Integer cantidad = 0;
        do{

            Producto nuevo_producto = new Producto();
            boolean id_activo = false;

            do{


                ////MOSTRAR LISTA PRODUCTOS/////
                for (Producto p : productos) {
                    System.out.println("///////////////");
                    System.out.println("Id: " + p.getId());
                    System.out.println("Nombre: " + p.getNombre());
                    System.out.println("Precio: " + p.getPrecio());
                    System.out.println("Stock: "+ p.getStock());
                    System.out.println("///////////////");
                }

                    System.out.println("Seleccione el producto por id: ");
                    Long id_producto_seleccionado = Long.parseLong(sc.nextLine());
                    Optional<Producto> producto_seleccionado = productoRepository.buscarPorId(id_producto_seleccionado);

                    if (producto_seleccionado.isEmpty() || producto_seleccionado.get().isEliminado()){
                        System.out.println("El id de este producto no existe!");
                        id_activo = false;
                    }else{
                        id_activo = true;
                        nuevo_producto = producto_seleccionado.get();
                    }
            }while(id_activo == false);



            boolean mayor_que_0 = false;
            do{
                System.out.println("Ingrese la cantidad: ");
                cantidad = Integer.parseInt(sc.nextLine());

                if (cantidad > 0 && nuevo_producto.getStock() >= cantidad) {
                    mayor_que_0 = true;

                }else if (nuevo_producto.getStock() < cantidad){
                    System.out.println("No alcanza stock");
                    mayor_que_0 = false;
                }else{
                    mayor_que_0 = false;
                }

            }while (mayor_que_0 == false);


            lista_temporal.put(nuevo_producto, cantidad);
            System.out.println("Desea seguir agregando productos?(1 = si / 0 = no):");
            seguir = Integer.parseInt(sc.nextLine());

        }while(seguir == 1);


        EntityManager em = JpaUtils.getEmf().createEntityManager();
        EntityTransaction tx = em.getTransaction();

        try{

            tx.begin();

            Usuario usuarioGestionado = em.find(Usuario.class, usuario.get().getId());

            /// INICIALIZAR PEDIDO////////////////////
            Pedido pedido = Pedido.builder()
                    .fecha(LocalDate.now())
                    .usuario(usuarioGestionado)
                    .estado(Estado.PENDIENTE)
                    .formaPago(formaPago)
                    .build();


            /// Creamos el detalle y lo agregamos a la lista de detallles en pedido///////
            for (Map.Entry<Producto, Integer> entry : lista_temporal.entrySet()){

                Producto prod = entry.getKey();
                Integer cant = entry.getValue();

                Producto producto_agregar = em.find(Producto.class, prod.getId());
                pedido.addDetallePedido(cant, producto_agregar);
                producto_agregar.setStock(producto_agregar.getStock() - cant);
            }

            em.persist(pedido);
            tx.commit(); ///Confirmar cambios//

        }catch (Exception e) {
            if (tx != null && tx.isActive()) {
                tx.rollback(); // 4. Rollback en caso de fallo
            }
            System.err.println("Error al guardar el pedido: " + e.getMessage());
            e.printStackTrace();
        } finally {
            em.close();
        }

    }

    public static void bajaPedido(){
            listarPedidos();
            System.out.println("Ingrese el id del id del pedido a eliminar: ");
            Long id_buscar = Long.parseLong(sc.nextLine());
            pedidoRepository.eliminadoLogico(id_buscar);
    }

    public static void modificarEstado(){
        System.out.println("Estados: ");
        System.out.println("1. PENDIENTE");
        System.out.println("2. CONFIRMADO");
        System.out.println("3. TERMINADO");
        System.out.println("4. CANCELADO");
        System.out.println("Elija un estado: ");
        Integer opcion = Integer.parseInt(sc.nextLine());

        Estado estado;
        switch (opcion){
            case 1: estado = Estado.PENDIENTE; break;
            case 2: estado = Estado.CONFIRMADO; break;
            case 3: estado = Estado.TERMINADO; break;
            case 4: estado = Estado.CANCELADO; break;
            default: estado = null; break;
        }

        System.out.println("/////PEDIDOS//////////////");
        listarPedidos();
        System.out.println("Seleccione un pedido por id: ");
        Long id_pedido = Long.parseLong(sc.nextLine());

        Pedido pedido = pedidoRepository.modificarEstado(estado, id_pedido);
        System.out.println("///////////////////////");
        System.out.println("Id: " + pedido.getId());
        System.out.println("Total: " + pedido.getTotal());
        System.out.println("Fecha: " + pedido.getFecha() );
        System.out.println("Estado: " + pedido.getEstado());
        System.out.println("///////////////////////");
    }

    public static void listarPedidos(){
        List<Pedido> pedidos = pedidoRepository.listarPedidos();

        for(Pedido ped : pedidos){
            System.out.println("//////////////////");
            System.out.println("Long id: " + ped.getId());
            System.out.println("fecha: " + ped.getFecha());
            System.out.println("total: " + ped.getTotal());
            System.out.println("forma pago: " + ped.getFormaPago());
            System.out.println("Nombre usuario: " + ped.getUsuario().getNombre());
            System.out.println("//////////detalles//////////////////////");
            for(DetallePedido detallePedido : ped.getDetalles()){
                System.out.println("////////////////////////////////////");
                System.out.println("subtotal: " + detallePedido.getSubtotal());
                System.out.println("Nombre producto: " + detallePedido.getProducto().getNombre());
                System.out.println("Cantidad: " + detallePedido.getCantidad());
                System.out.println("/////////////////////////////////");
            }
        }
    }



    /// ////////////PRODUCTOS////////////////////////



    public static void altaProducto(){
        sc.nextLine();
        System.out.println("Ingrese el Nombre de su producto: ");
        String nombreProducto = sc.nextLine();
        System.out.println("Ingrese el precio del producto: ");
        Double precioProducto = Double.parseDouble(sc.nextLine());
        System.out.println("Ingrese el stock del producto: ");
        Integer stockProducto = Integer.parseInt(sc.nextLine());
        System.out.println("Ingrese el src de la imagen: ");
        String imagenProducto = sc.nextLine();
        System.out.println("Ingrese la Descripcion de su producto: ");
        String descripcion = sc.nextLine();
        System.out.println("Ingrese el Id de la categoria: ");
        Long id_categoria = Long.parseLong(sc.nextLine());

        Optional<Categoria> categoriaProducto = categoriaRepository.buscarPorId(id_categoria);

        Producto producto = Producto.builder()
                .nombre(nombreProducto)
                .precio(precioProducto)
                .stock(stockProducto)
                .imagen(imagenProducto)
                .descripcion(descripcion)
                .categoria(categoriaProducto.get())
                .disponible(true)
                .build();

        Producto guardado = productoRepository.guardar(producto);

        if (guardado != null){
            System.out.println("Producto guardado nombre: " + guardado + " id: " + guardado);
        }
    }


    public static void bajaProducto(){
        System.out.println("Ingrese el id a buscar: ");
        Long id_buscar = Long.parseLong(sc.nextLine());
         Optional<Producto> productoBuscado = productoRepository.buscarPorId(id_buscar);
         if(productoBuscado.isEmpty() || productoBuscado.get().isEliminado()){
             System.out.println("El producto no existe o no se encuentra activo");
             return;
         }
        productoRepository.eliminadoLogico(id_buscar);
        System.out.println("Producto: " + productoBuscado.get().getNombre() + " Id: " + productoBuscado.get().getId() + " fue eliminado");
    }


    public static void modificarProducto(){
        System.out.println("Buscar Id producto a modificar: ");
        Long id_buscar = sc.nextLong();
        Optional<Producto> productoBuscado = productoRepository.buscarPorId(id_buscar);
        if(productoBuscado.isEmpty()){
            System.out.println("El producto a modificar no existe");
            return;
        }


        System.out.println("///////////////////////");
        System.out.println("///valores actuales///");
        System.out.println("Nombre: " + productoBuscado.get().getNombre());
        System.out.println("Precio: " + productoBuscado.get().getPrecio());
        System.out.println("Descripcion: " + productoBuscado.get().getDescripcion());
        System.out.println("Stock: " + productoBuscado.get().getStock());
        System.out.println("Categoria: "+ productoBuscado.get().getCategoria().getNombre());
        System.out.println("//////////////////////////");
        sc.nextLine();
        System.out.println("Ingrese el Nombre de su producto: ");
        String nombreProducto = sc.nextLine();
        System.out.println("Ingrese el precio del producto: ");
        Double precioProducto = Double.parseDouble(sc.nextLine());
        System.out.println("Ingrese el stock del producto: ");
        Integer stockProducto = Integer.parseInt(sc.nextLine());
        System.out.println("Ingrese el src de la imagen: ");
        String imagenProducto = sc.nextLine();
        System.out.println("Ingrese la Descripcion de su categoria: ");
        String descripcion = sc.nextLine();
        System.out.println("Ingrese el Id de la categoria: ");
        Long id_categoria = Long.parseLong(sc.nextLine());
        System.out.println("Esta eliminado? 1:si 2:no");
        Integer opcion = Integer.parseInt(sc.nextLine());

        if (opcion == 1){
            productoBuscado.get().setEliminado(true);
        }else{
            productoBuscado.get().setEliminado(false);
        }
        Optional<Categoria> categoriaBuscada = categoriaRepository.buscarPorId(id_categoria);


        productoBuscado.get().setNombre(nombreProducto);
        productoBuscado.get().setPrecio(precioProducto);
        productoBuscado.get().setStock(stockProducto);
        productoBuscado.get().setImagen(imagenProducto);
        productoBuscado.get().setDescripcion(descripcion);
        productoBuscado.get().setCategoria(categoriaBuscada.get());

        Producto guardado = productoRepository.guardar(productoBuscado.get());

        System.out.println("///////////////////////");
        System.out.println("///valores nuevos///");
        System.out.println("Nombre: " + guardado.getNombre());
        System.out.println("Precio: " + guardado.getPrecio());
        System.out.println("Descripcion: " + guardado.getDescripcion());
        System.out.println("Stock: " + guardado.getStock());
        System.out.println("Categoria: "+ guardado.getCategoria().getNombre());
        System.out.println("//////////////////////////");

    }



    public static void listarProductos(){
        List<Producto> listaProductos = productoRepository.listarActivos();
        if (listaProductos.size() == 0){
            System.out.println("No hay productos disponibles");
        }
        listaProductos.forEach(p -> {
            System.out.println("Id: " + p.getId());
            System.out.println("Nombre: " + p.getNombre());
            System.out.println("Precio: " + p.getPrecio());
            System.out.println("Stock: " + p.getStock());
            System.out.println("Categoria: " + p.getCategoria().getNombre());
            System.out.println("--------------------------------");
        });
    }








    /// ////////////REPORTES////////////////

    public static void ProductoXCategoria(){
        List<Categoria> categoriaList = categoriaRepository.listarActivos();

        if(categoriaList.isEmpty()){
            System.out.println("No hay categorias disponibles.......");
            return;
        }
        sc.nextLine();
        System.out.println("Seleccione una categoria: ");
        categoriaList.forEach(c -> System.out.printf("  [%d] %s%n", c.getId(), c.getNombre()));
        System.out.print("Ingrese el id de la categoria: ");
        Long id_categoria = Long.parseLong(sc.nextLine());


        List<Producto> productos = productoRepository.buscarPorCategoria(id_categoria);
        if(productos.isEmpty()){
            System.out.println("No existen productos con esta categoria");
            return;
        }
        productos.forEach(p -> {
            System.out.println("/////////////////////////////////////");
            System.out.println("Id: " + p.getId());
            System.out.println("Nombre: " + p.getNombre());
            System.out.println("Descripcion: " + p.getDescripcion());
            System.out.println("Precio: " + p.getPrecio());
            System.out.println("Stock: " + p.getStock());
            System.out.println("Categoria: " + p.getCategoria().getNombre());
            System.out.println("/////////////////////////////////////");
        });
    }


    public static void auxiliarListarPedidos(List<Pedido> pedidos){
        for(Pedido ped : pedidos){
            System.out.println("//////////////////");
            System.out.println("Long id: " + ped.getId());
            System.out.println("fecha: " + ped.getFecha());
            System.out.println("total: " + ped.getTotal());
            System.out.println("forma pago: " + ped.getFormaPago());
            System.out.println("Nombre usuario: " + ped.getUsuario().getNombre());
            System.out.println("//////////detalles//////////////////////");
            for(DetallePedido detallePedido : ped.getDetalles()){
                System.out.println("////////////////////////////////////");
                System.out.println("subtotal: " + detallePedido.getSubtotal());
                System.out.println("Nombre producto: " + detallePedido.getProducto().getNombre());
                System.out.println("Cantidad: " + detallePedido.getCantidad());
                System.out.println("/////////////////////////////////");
            }
        }
    }


    public static void PedidoXEstado(){
        System.out.println("Estados: ");
        System.out.println("1. PENDIENTE");
        System.out.println("2. CONFIRMADO");
        System.out.println("3. TERMINADO");
        System.out.println("4. CANCELADO");
        System.out.println("Elija un estado: ");
        Integer opcion = Integer.parseInt(sc.nextLine());

        Estado estado;
        switch (opcion){
            case 1: estado = Estado.PENDIENTE; break;
            case 2: estado = Estado.CONFIRMADO; break;
            case 3: estado = Estado.TERMINADO; break;
            case 4: estado = Estado.CANCELADO; break;
            default: estado = null; break;
        }

        List<Pedido> pedidos = pedidoRepository.buscarPorEstado(estado);
        auxiliarListarPedidos(pedidos);
    }


    public static void PedidosXUsuario(){
        listarUsuarios();
        System.out.println("Seleccione un usuario por id: ");
        Long id_usuario = Long.parseLong(sc.nextLine());

        List<Pedido> pedidos = pedidoRepository.buscarPorUsuario(id_usuario);

        auxiliarListarPedidos(pedidos);
    }


    public static void calcularTotal(){
        Double total = 0.0;
        List<Pedido> pedidosTerminados = pedidoRepository.buscarPorEstado(Estado.TERMINADO);

        if (pedidosTerminados.size() == 0){
            System.out.println("El total es: " + total);
            return;
        }else{
            for (Pedido ped : pedidosTerminados){
                total += ped.getTotal();
            }
            System.out.println("El total es: " + total);
        }
    }

}