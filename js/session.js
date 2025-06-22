// js/session.js

// Función para verificar si el usuario está logueado
function isLoggedIn() {
    return localStorage.getItem('user') !== null;
}

// Función para obtener el usuario actual
function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// Función para cerrar sesión
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Función para actualizar la navegación según el estado de la sesión
function updateNavigation() {
    const loginButtons = document.getElementById('login-buttons');
    const userMenu = document.getElementById('user-menu');
    const userNameSpan = document.getElementById('user-name');
    
    // Se seleccionan ambos posibles enlaces de "Reservas" para cubrir las inconsistencias del HTML
    const navReservas = document.querySelector('.navbar-nav a[href="reservas.html"]');
    const navMisReservas = document.querySelector('.navbar-nav a[href="mis-reservas.html"]');

    const navAmenidades = document.querySelector('a[href="amenidades.html"]');
    const dropdownMisReservas = document.querySelector('#user-menu a[href="mis-reservas.html"]');
    const user = getCurrentUser();

    // Ocultar siempre "Amenidades"
    if (navAmenidades) {
        navAmenidades.parentElement.style.display = 'none';
    }

    if (isLoggedIn()) {
        // Mostrar menú de usuario y ocultar botones de login
        if (loginButtons) loginButtons.classList.add('d-none');
        if (userMenu) {
            userMenu.classList.remove('d-none');
            if (userNameSpan && user) {
                userNameSpan.textContent = user.nombre;
            }
        }
        
        // --- Lógica de visibilidad de enlaces por rol ---
        // Si el usuario es admin, ocultar enlaces de reservas
        if (user && user.isAdmin) {
            if (navReservas) navReservas.parentElement.style.display = 'none';
            if (navMisReservas) navMisReservas.parentElement.style.display = 'none';
            if (dropdownMisReservas) dropdownMisReservas.parentElement.style.display = 'none';

        } else {
            // Si no es admin (es cliente), mostrar enlaces de reservas
             if (navReservas) navReservas.parentElement.style.display = 'block';
             if (navMisReservas) navMisReservas.parentElement.style.display = 'block';
             if (dropdownMisReservas) dropdownMisReservas.parentElement.style.display = 'block';
        }

    } else {
        // --- Usuario no logueado ---
        // Mostrar botones de login y ocultar menú de usuario
        if (loginButtons) loginButtons.classList.remove('d-none');
        if (userMenu) userMenu.classList.add('d-none');
        
        // Ocultar "Reservas" si no ha iniciado sesión
        if (navReservas) navReservas.parentElement.style.display = 'none';
        if (navMisReservas) navMisReservas.parentElement.style.display = 'none';
    }
}

// Función para verificar el acceso a la página según el rol del usuario
function checkPageAccess() {
    const user = getCurrentUser();
    const currentPage = window.location.pathname;

    // --- Definición de Reglas de Acceso ---
    // Páginas a las que un admin NO puede acceder
    const adminRestrictedPages = ['/registro.html', '/reservas.html', '/mis-reservas.html', '/editar-reserva.html'];
    
    // Páginas que SIEMPRE requieren que el usuario haya iniciado sesión
    const authRequiredPages = ['/perfil.html', '/reservas.html', '/mis-reservas.html', '/editar-reserva.html', '/gestion-habitacion.html'];

    // Página no visible para ningún rol
    if (currentPage.endsWith('/amenidades.html')) {
        window.location.href = 'index.html';
        return;
    }

    // --- Aplicación de Reglas ---
    // 1. Si el usuario NO está logueado y la página requiere autenticación
    if (!isLoggedIn() && authRequiredPages.some(page => currentPage.endsWith(page))) {
        window.location.href = 'login.html';
        return;
    }

    // 2. Si el usuario SÍ está logueado
    if (user) {
        // Y es un admin intentando acceder a una página restringida para él
        if (user.isAdmin && adminRestrictedPages.some(page => currentPage.endsWith(page))) {
            window.location.href = 'index.html';
            return;
        }
        // Y NO es admin pero intenta acceder a la gestión de habitaciones
        if (!user.isAdmin && currentPage.endsWith('/gestion-habitacion.html')) {
            window.location.href = 'habitaciones.html';
            return;
        }
    }
}

// --- Event Listeners ---

// 1. Actualizar la navegación y verificar acceso cuando la página se ha cargado
document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();
    checkPageAccess(); // <- Se añade la verificación de acceso
});

// 2. Escuchar cambios en el localStorage para mantener la sesión actualizada entre pestañas
window.addEventListener('storage', (event) => {
    // Si el cambio ocurrió en la clave 'user' (login/logout)
    if (event.key === 'user') {
        // Vuelve a ejecutar la función que actualiza la barra de navegación
        updateNavigation();
    }
}); 