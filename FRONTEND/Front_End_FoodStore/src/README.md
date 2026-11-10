🍕 Food Store - Frontend TPI
Este es el proyecto integrador (TPI) para el Frontend de un sistema de comercio electrónico de comida (Food Store).

 La aplicación está construida utilizando TypeScript Vanilla y bundler Vite, gestionando el estado, la sesión y la persistencia de datos localmente.
 
 🚀 Tecnologías Utilizadas
 _HTML5 & CSS3 (Diseño responsive y componentes dinámicos)
 _TypeScript Vanilla (Tipado estricto y lógica del DOM)
 _Vite (Entorno de desarrollo y empaquetador rápido)
 _LocalStorage (Simulación de base de datos para usuarios, productos, carrito y pedidos)
 
 
 🔑 Credenciales de Acceso
 
 El sistema cuenta con usuarios precargados para probar las distintas funcionalidades según el 
 rol:
 Email cliente: cliente@food.com
 password cliente: cliente123
(Tienda, Carrito, Mis Pedidos)

Administrador
email: admin@admin.com
password: 123456
(Panel de Administración, Gestión de Productos, Categorías y Pedidos)


💡 Registro: También puedes registrar tu propio usuario desde la pantalla de login/registro para ingresar como cliente.

🔄 Flujo de Trabajo (Experiencia del Cliente)
Autenticación (Login / Registro):
Ingresas con las credenciales de cliente o creas una cuenta nueva.

Exploración del Catálogo (Home Store):Al iniciar sesión, accedes al panel principal con el listado de productos disponibles.
Puedes explorar los platos y seleccionar los que desees comprar presionando "Agregar".

Carrito de Compras:Los productos seleccionados se guardan en el carrito.En la vista del carrito puedes modificar las cantidades de cada producto o eliminarlos.

Para finalizar, presionas "Proceder al Pago", completas los datos de entrega/pago y confirmas la compra.

Mis Pedidos:Una vez confirmada la compra, en el menú superior o dentro del carrito encuentras el botón "Mis Pedidos".
Allí podrás consultar el historial completo de todas las órdenes que has realizado junto con su estado actual (PENDIENTE, EN PREPARACIÓN, ENTREGADO, etc.).