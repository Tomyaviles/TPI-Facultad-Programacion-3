☕ Food Store - Backend API & Gestor DB

Este es el módulo Backend para el sistema de comercio electrónico Food Store. 
Está desarrollado en Java utilizando JPA (Java Persistence API / Hibernate) 
para el mapeo objeto-relacional y una base de datos en memoria/archivo H2, 
ofreciendo un panel interactivo por consola para la gestión completa de entidades y reportes.


🚀 Tecnologías Utilizadas
Java (JDK 17 o superior)

JPA / Hibernate (Mapeo objeto-relacional y persistencia)

H2 Database (Base de datos relacional ligera e embebida)

Maven/ GRADLE(Gestión de dependencias)


Configuración y Conexión a la Base de Datos H2

La conexión con la base de datos H2 se gestiona a través del archivo persistence.xml

Consola Web H2: Si deseas inspeccionar las tablas visualmente desde el navegador, puedes habilitar
la consola de H2 ejecutando la base de datos en modo TCP o mediante el servidor H2 en la ruta http://localhost:8082

Funcionalidades Principales

Al iniciar la aplicación, se despliega un Menú Interactivo por consola que permite navegar 
entre las distintas áreas del sistema:


====================================
FOOD STORE - BACKEND MENU     
====================================
1. Productos
2. Usuarios
3. Pedidos
4. Categorías
5. Reportes
0. Salir
   ====================================

Módulos del Sistema:
📦 Gestión de Productos: CRUD completo de productos (creación, edición de stock/precio, baja lógica y consulta).

👤 Gestión de Usuarios: Registro de clientes y administradores, actualización de datos de contacto y roles.

🛒 Gestión de Pedidos: Registro de órdenes de compra, cálculo de totales/subtotales y actualización de estado (PENDIENTE, EN_PREPARACION, ENTREGADO, CANCELADO).

🏷️ Gestión de Categorías: Clasificación y organización de los productos de la tienda.

📊 Reportes: Consultas optimizadas con JPQL para obtener ventas totales, productos más vendidos e historial de compras por usuario


