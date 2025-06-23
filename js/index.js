// js/index.js

document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        // Configurar las fechas mínimas para los inputs de fecha
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('check-in').min = today;
        document.getElementById('check-out').min = today;

        // Actualizar la fecha mínima de salida cuando se selecciona la fecha de llegada
        document.getElementById('check-in').addEventListener('change', function() {
            const checkInDate = new Date(this.value);
            checkInDate.setDate(checkInDate.getDate() + 1);
            document.getElementById('check-out').min = checkInDate.toISOString().split('T')[0];
        });

        searchForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const checkIn = document.getElementById('check-in').value;
            const checkOut = document.getElementById('check-out').value;

            if (checkIn && checkOut) {
                // Redirigir a la página de habitaciones con los parámetros de fecha
                window.location.href = `habitaciones.html?check-in=${checkIn}&check-out=${checkOut}`;
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Faltan fechas',
                    text: 'Por favor, selecciona las fechas de llegada y salida.',
                    timer: 5000,
                    showConfirmButton: false
                });
            }
        });
    }
});

// Función para ver las habitaciones disponibles
function verHabitaciones() {
    const checkIn = document.getElementById('check-in').value;
    const checkOut = document.getElementById('check-out').value;

    if (!checkIn || !checkOut) {
        alert('Por favor, selecciona las fechas de llegada y salida.');
        return;
    }

    // Redirigir a la página de habitaciones con los parámetros de fecha
    window.location.href = `habitaciones.html?check-in=${checkIn}&check-out=${checkOut}`;
} 