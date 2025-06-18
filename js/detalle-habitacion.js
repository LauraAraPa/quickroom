// js/detalle-habitacion.js

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const habitacionId = urlParams.get('id');
    const API_URL_HABITACIONES = 'http://localhost:8081/api/habitaciones';

    const mainContent = document.querySelector('.container.mt-5.pt-5');

    // Imágenes placeholder (las mismas de la página de habitaciones)
    const imagenesHabitacion = {
        'Familiar': "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        'Doble': "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
        'Sencilla': "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
        'Suite Ejecutiva': "https://images.unsplash.com/photo-1591088398332-8a7791972843?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
    };

    if (!habitacionId) {
        mainContent.innerHTML = `<div class="alert alert-danger">No se ha especificado una habitación. Serás redirigido.</div>`;
        setTimeout(() => window.location.href = 'habitaciones.html', 3000);
        return;
    }

    const formatearPrecio = (precio) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(precio);
    };

    const cargarDetallesHabitacion = async () => {
        mainContent.innerHTML = `<div class="alert alert-info">Cargando detalles de la habitación...</div>`;
        try {
            const response = await fetch(`${API_URL_HABITACIONES}/${habitacionId}`);
            if (!response.ok) {
                throw new Error('No se pudo encontrar la habitación solicitada.');
            }
            const habitacion = await response.json();

            // Restaurar el HTML original y luego poblarlo
            mainContent.innerHTML = `
                <div class="row">
                    <div class="col-md-8">
                        <img id="room-image" src="" alt="Habitación" class="room-image w-100 mb-4">
                        <h1 id="room-type" class="mb-4"></h1>
                        <p id="room-description" class="lead mb-4"></p>
                        
                        <h3 class="mb-3">Características</h3>
                        <div class="row mb-4">
                            <div class="col-md-6">
                                <ul class="list-unstyled">
                                    <li class="mb-2"><i class="bi bi-people amenity-icon"></i> <span id="room-beds"></span></li>
                                    <li class="mb-2"><i class="bi bi-rulers amenity-icon"></i> <span id="room-bed-type"></span></li>
                                </ul>
                            </div>
                            <div class="col-md-6">
                                <ul class="list-unstyled">
                                    <li class="mb-2"><i class="bi bi-wifi amenity-icon"></i> WiFi de alta velocidad</li>
                                    <li class="mb-2"><i class="bi bi-tv amenity-icon"></i> TV Smart 55"</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card shadow-sm">
                            <div class="card-body">
                                <h3 class="card-title mb-4">Reservar Ahora</h3>
                                <p class="price-tag mb-4" id="room-price"></p>
                                <div class="mb-3">
                                    <label for="check-in" class="form-label">Fecha de llegada</label>
                                    <input type="date" class="form-control" id="check-in" required>
                                </div>
                                <div class="mb-3">
                                    <label for="check-out" class="form-label">Fecha de salida</label>
                                    <input type="date" class="form-control" id="check-out" required>
                                </div>
                                <button class="btn btn-primary w-100" onclick="manejarReserva()">
                                    <i class="bi bi-calendar-check"></i> Reservar ahora
                                </button>
                            </div>
                        </div>
                    </div>
                </div>`;

            // Poblar los datos
            document.getElementById('room-image').src = imagenesHabitacion[habitacion.tipo_habitacion] || imagenesHabitacion['Doble'];
            document.getElementById('room-type').textContent = habitacion.tipo_habitacion;
            document.getElementById('room-description').textContent = `Una cómoda habitación de tipo ${habitacion.tipo_habitacion.toLowerCase()} con ${habitacion.numero_de_camas} cama(s) de tipo ${habitacion.tipo_de_cama.toLowerCase()}.`;
            document.getElementById('room-beds').textContent = `${habitacion.numero_de_camas} Cama(s)`;
            document.getElementById('room-bed-type').textContent = `Tipo: ${habitacion.tipo_de_cama}`;
            document.getElementById('room-price').textContent = formatearPrecio(habitacion.precio_habitacion) + ' por noche';

            // Configurar fechas
            const today = new Date().toISOString().split('T')[0];
            const checkInInput = document.getElementById('check-in');
            const checkOutInput = document.getElementById('check-out');
            checkInInput.min = today;
            
            checkInInput.addEventListener('change', function() {
                let nextDay = new Date(this.value);
                nextDay.setDate(nextDay.getDate() + 1);
                checkOutInput.min = nextDay.toISOString().split('T')[0];
            });

        } catch (error) {
            mainContent.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
        }
    };

    cargarDetallesHabitacion();
});

// Se añade la función de reserva aquí para que sea global y accesible desde el HTML
function manejarReserva() {
    const urlParams = new URLSearchParams(window.location.search);
    const habitacionId = urlParams.get('id');

    const checkIn = document.getElementById('check-in').value;
    const checkOut = document.getElementById('check-out').value;
    
    if (!checkIn || !checkOut) {
        alert('Por favor, selecciona las fechas de entrada y salida');
        return;
    }
    
    // Verificar si el usuario está autenticado
    const token = localStorage.getItem('user'); // Se verifica 'user' para consistencia
    
    if (!token) {
        // Guardar los datos de la reserva en sessionStorage para recuperarlos después del login
        sessionStorage.setItem('habitacionReserva', habitacionId);
        sessionStorage.setItem('fechaEntrada', checkIn);
        sessionStorage.setItem('fechaSalida', checkOut);
        
        // Redirigir al login
        window.location.href = 'login.html';
    } else {
        // Redirigir a la página de reservas con los datos. Se usa 'habitacion' como clave en la URL.
        window.location.href = `reservas.html?habitacion=${habitacionId}&check-in=${checkIn}&check-out=${checkOut}`;
    }
} 