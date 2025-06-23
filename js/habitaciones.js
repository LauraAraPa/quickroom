// js/habitaciones.js

document.addEventListener('DOMContentLoaded', () => {
    const habitacionesContainer = document.getElementById('habitaciones-container');
    const API_URL_HABITACIONES = 'http://localhost:8081/api/habitaciones';
    const currentUser = getCurrentUser(); // Se obtiene el usuario actual
    const isAdmin = currentUser && currentUser.isAdmin; // Se verifica si es admin

    // Imágenes placeholder para cada tipo de habitación
    const imagenesHabitacion = {
        'Familiar': "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        'Doble': "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
        'Sencilla': "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
        'Nueva Habitacion': "https://images.unsplash.com/photo-1591088398332-8a7791972843?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
    };
    
    // Función para formatear el precio a COP
    function formatearPrecio(precio) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(precio);
    }

    // Función para mostrar los detalles de la habitación, ahora global
    window.mostrarDetalles = function(habitacionId) {
        window.location.href = `detalle-habitacion.html?id=${habitacionId}`;
    }

    // --- Funciones de Admin ---
    window.crearHabitacion = function() {
        window.location.href = 'gestion-habitacion.html';
    }

    window.editarHabitacion = function(habitacionId) {
        window.location.href = `gestion-habitacion.html?id=${habitacionId}`;
    }

    window.eliminarHabitacion = async function(habitacionId) {
        if (confirm('¿Está seguro de que desea eliminar esta habitación?')) {
            try {
                const response = await fetch(`${API_URL_HABITACIONES}/${habitacionId}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('No se pudo eliminar la habitación.');
                
                alert('Habitación eliminada correctamente.');
                cargarHabitaciones(); // Recargar la lista
            } catch (error) {
                alert(`Error: ${error.message}`);
                console.error("Error al eliminar habitación:", error);
            }
        }
    }

    // Cargar y renderizar las habitaciones desde la API
    const cargarHabitaciones = async () => {
        habitacionesContainer.innerHTML = `<p class="text-center">Cargando habitaciones...</p>`;
        try {
            const response = await fetch(API_URL_HABITACIONES);
            if (!response.ok) {
                throw new Error('No se pudieron cargar los datos de las habitaciones.');
            }
            let habitaciones = await response.json();
            
            // Si el usuario no es admin, filtrar para mostrar solo habitaciones disponibles
            if (!isAdmin) {
                habitaciones = habitaciones.filter(h => h.disponible);
            }

            if (habitaciones.length === 0 && !isAdmin) {
                habitacionesContainer.innerHTML = `<div class="alert alert-warning">No hay habitaciones disponibles en este momento.</div>`;
                return;
            }

            let habitacionesHtml = habitaciones.map(habitacion => {
                // Lógica de botones según el rol
                const botonesHtml = isAdmin
                    ? `
                        <div class="d-flex justify-content-between mt-auto">
                            <button type="button" class="btn btn-outline-primary btn-sm" onclick="editarHabitacion(${habitacion.id})">
                                <i class="bi bi-pencil-square"></i> Editar
                            </button>
                            <button type="button" class="btn btn-outline-danger btn-sm" onclick="eliminarHabitacion(${habitacion.id})">
                                <i class="bi bi-trash"></i> Eliminar
                            </button>
                        </div>
                    `
                    : `
                        <div class="text-center mt-auto">
                            <button type="button" class="btn btn-primary w-100" onclick="mostrarDetalles(${habitacion.id})">
                                <i class="bi bi-info-circle"></i> Ver detalles
                            </button>
                        </div>
                    `;

                const disponibilidadBadge = habitacion.disponible
                    ? `<span class="badge bg-success">Disponible</span>`
                    : `<span class="badge bg-danger">No Disponible</span>`;

                return `
                    <div class="col-md-6 col-lg-3 mb-4 d-flex align-items-stretch">
                        <div class="card h-100 shadow-sm room-card w-100">
                            <img src="${imagenesHabitacion[habitacion.tipo_habitacion] || imagenesHabitacion['Doble']}" class="card-img-top" alt="${habitacion.tipo_habitacion}" style="height: 200px; object-fit: cover;">
                            <div class="card-body d-flex flex-column">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <h5 class="card-title mb-0">${habitacion.tipo_habitacion}</h5>
                                    ${disponibilidadBadge}
                                </div>
                                <p class="card-text">
                                    <small class="text-muted">
                                        <i class="bi bi-people"></i> Camas: ${habitacion.numero_de_camas} (${habitacion.tipo_de_cama})<br>
                                        <i class="bi bi-currency-dollar"></i> Precio: <strong>${formatearPrecio(habitacion.precio_habitacion)}</strong> por noche
                                    </small>
                                </p>
                                ${botonesHtml}
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            // Si es admin, añadir la tarjeta para crear una nueva habitación
            if (isAdmin) {
                habitacionesHtml += `
                    <div class="col-md-6 col-lg-3 mb-4 d-flex align-items-stretch">
                        <div class="card h-100 shadow-sm room-card w-100 text-center" style="cursor: pointer;" onclick="crearHabitacion()">
                            <div class="card-body d-flex flex-column justify-content-center align-items-center">
                                <i class="bi bi-plus-circle-dotted" style="font-size: 3rem; color: #0d6efd;"></i>
                                <h5 class="card-title mt-3">Crear Nueva Habitación</h5>
                            </div>
                        </div>
                    </div>
                `;
            }

            habitacionesContainer.innerHTML = habitacionesHtml;

        } catch (error) {
            habitacionesContainer.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
            console.error("Error al cargar habitaciones:", error);
        }
    };

    cargarHabitaciones();
});
