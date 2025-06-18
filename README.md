# QuickRoom - Plataforma de Reservas de Hotel

QuickRoom es una aplicación web diseñada para simplificar la gestión y reserva de habitaciones de hotel. Permite a los usuarios explorar habitaciones, gestionar sus perfiles y administrar sus reservas de forma intuitiva.

## Funcionalidades Implementadas

Hasta el momento, la aplicación cuenta con el siguiente flujo de funcionalidades básicas:

### Gestión de Usuarios
- **Registro de Nuevos Usuarios**: Los usuarios pueden crear una nueva cuenta proporcionando sus datos básicos.
- **Inicio de Sesión**: Los usuarios registrados pueden acceder a la plataforma con su correo y contraseña.
- **Gestión de Perfil**: Una vez dentro, los usuarios pueden ver y editar la información de su perfil (nombre, celular, etc.) y eliminar su cuenta si lo desean.

### Exploración y Reserva de Habitaciones
- **Catálogo de Habitaciones**: La página principal muestra una lista de todas las habitaciones disponibles, cargando la información (tipo, precio, camas) directamente desde la base de datos.
- **Detalle de Habitación**: Al seleccionar una habitación, el usuario puede ver una página con sus detalles específicos.
- **Creación de Reservas**: Los usuarios pueden seleccionar fechas y confirmar una reserva para una habitación específica. El formulario se autocompleta con los datos del perfil del usuario.

### Gestión de Reservas
- **Mis Reservas**: Los usuarios tienen una sección personal donde pueden ver un listado de todas las reservas que han realizado.
- **Cancelación de Reservas**: Dentro de su listado, los usuarios tienen la opción de cancelar una reserva existente.

---

## Stack Tecnológico

La aplicación está construida sobre una arquitectura de microservicios, lo que separa las responsabilidades y facilita el mantenimiento.

-   **Frontend**:
    -   **HTML5**: Para la estructura de las páginas.
    -   **CSS3**: Para los estilos base.
    -   **JavaScript (ES6+)**: Para la lógica del lado del cliente, la interactividad y la comunicación con las APIs.
    -   **Bootstrap 5**: Framework de CSS utilizado para el diseño responsive y los componentes de la interfaz de usuario.

-   **Backend (Arquitectura de Microservicios)**:
    -   **Java y Spring Boot**: Para la construcción de los servicios RESTful.
    -   **Servicio de Usuarios**: Desplegado en `http://localhost:8080`. Gestiona todo lo relacionado con la autenticación y los perfiles de usuario.
    -   **Servicio de Habitaciones**: Desplegado en `http://localhost:8081`. Gestiona el catálogo y los detalles de las habitaciones.
    -   **Servicio de Reservas**: Desplegado en `http://localhost:8083`. Gestiona la creación, consulta y cancelación de reservas.

-   **Base de Datos**:
    -   El proyecto utiliza una base de datos relacional (como MySQL, PostgreSQL, etc.) gestionada a través de Spring Data JPA en el backend.

---

## Guía de Despliegue en Local

Para poder ejecutar y probar la aplicación en tu máquina local, sigue estos pasos:

### 1. Desplegar el Backend

Es crucial que los tres servicios del backend estén corriendo simultáneamente, ya que el frontend depende de ellos.

-   **Requisitos**:
    -   Tener instalado Java JDK (versión 17 o superior).
    -   Tener configurado Maven o Gradle.

-   **Instrucciones**:
    1.  Abre un terminal para cada uno de los tres servicios (Usuarios, Habitaciones, Reservas).
    2.  Navega a la carpeta raíz de cada proyecto de microservicio.
    3.  Ejecuta el comando para iniciar la aplicación Spring Boot. Si usas Maven, el comando es:
        ```bash
        mvn spring-boot:run
        ```
    4.  Verifica que cada servicio se haya iniciado correctamente en su puerto correspondiente (`8080`, `8081` y `8083`).

### 2. Desplegar el Frontend

El frontend está compuesto por archivos estáticos (HTML, CSS, JS), pero necesita ser servido a través de un servidor web local para evitar problemas de CORS al comunicarse con el backend.

-   **Requisitos**:
    -   Un navegador web moderno (Chrome, Firefox, Edge).
    -   Un editor de código como Visual Studio Code.

-   **Instrucciones (Recomendado)**:
    1.  Instala la extensión **"Live Server"** en Visual Studio Code.
    2.  Abre la carpeta raíz del proyecto frontend (`QuickRoom Web`) en VS Code.
    3.  Haz clic derecho sobre el archivo `index.html`.
    4.  Selecciona la opción **"Open with Live Server"**.
    5.  Esto abrirá automáticamente la aplicación en tu navegador en una dirección como `http://127.0.0.1:5501`, lista para usarse. 