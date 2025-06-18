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

    if (isLoggedIn()) {
        const user = getCurrentUser();
        // Mostrar menú de usuario y ocultar botones de login
        if (loginButtons) loginButtons.classList.add('d-none');
        if (userMenu) {
            userMenu.classList.remove('d-none');
            if (userNameSpan && user) {
                userNameSpan.textContent = user.nombre; // Asumiendo que el usuario tiene un campo 'nombre'
            }
        }
    } else {
        // Mostrar botones de login y ocultar menú de usuario
        if (loginButtons) loginButtons.classList.remove('d-none');
        if (userMenu) userMenu.classList.add('d-none');
    }
}

// --- Event Listeners ---

// 1. Actualizar la navegación cuando la página se ha cargado completamente
document.addEventListener('DOMContentLoaded', updateNavigation);

// 2. Escuchar cambios en el localStorage para mantener la sesión actualizada entre pestañas
window.addEventListener('storage', (event) => {
    // Si el cambio ocurrió en la clave 'user' (login/logout)
    if (event.key === 'user') {
        // Vuelve a ejecutar la función que actualiza la barra de navegación
        updateNavigation();
    }
}); 