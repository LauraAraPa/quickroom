document.addEventListener('DOMContentLoaded', () => {
    // 1. Verificar si el usuario está logueado
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (!currentUser) {
        alert('Debes iniciar sesión para ver tus reservas.');
        window.location.href = 'login.html';
        return;
    }

    // 2. Elementos del DOM y URL de la API
    const tableBody = document.getElementById('mis-reservas-container');
    const loadingMessage = document.getElementById('loading-message');
    const API_URL = 'http://localhost:8083/api/reservas';

    // 3. Función para cargar las reservas
    const cargarMisReservas = async () => {
        if (!tableBody || !loadingMessage) {
            console.error("No se encontraron los elementos necesarios en el DOM.");
            return;
        }

        loadingMessage.classList.remove('d-none');
        tableBody.innerHTML = ''; // Limpiar la tabla

        try {
            // 1. Obtener TODAS las reservas del servidor
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error('No se pudieron cargar las reservas desde el servidor.');
            }

            const todasLasReservas = await response.json();

            // 2. Filtrar las reservas para encontrar las del usuario actual
            // Corregido: El backend devuelve un campo plano 'idUsuario'
            const misReservas = todasLasReservas.filter(reserva => 
                reserva.idUsuario === currentUser.id
            );

            loadingMessage.classList.add('d-none');

            if (misReservas.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Aún no tienes reservas registradas.</td></tr>';
                return;
            }

            // 3. Renderizar las reservas filtradas
            misReservas.forEach(reserva => {
                const tr = document.createElement('tr');
                
                // Corregido: La propiedad correcta es 'idHabitacion', no 'habitacion'
                const tipoHabitacion = `Habitación ID: ${reserva.idHabitacion}`;

                tr.innerHTML = `
                    <td>${reserva.id}</td>
                    <td>${tipoHabitacion}</td>
                    <td>${new Date(reserva.fechaEntrada).toLocaleDateString()}</td>
                    <td>${new Date(reserva.fechaSalida).toLocaleDateString()}</td>
                    <td>${reserva.numeroPersonas}</td>
                    <td>
                        <button class="btn btn-sm btn-warning btn-editar" data-id="${reserva.id}">
                            <i class="bi bi-pencil"></i> Editar
                        </button>
                        <button class="btn btn-sm btn-danger btn-cancelar" data-id="${reserva.id}">
                            <i class="bi bi-trash"></i> Cancelar
                        </button>
                    </td>
                `;
                tableBody.appendChild(tr);
            });

        } catch (error) {
            console.error('Error al cargar mis reservas:', error);
            loadingMessage.textContent = 'Error al cargar tus reservas. Intenta de nuevo más tarde.';
            loadingMessage.classList.remove('d-none'); // Asegurarse de que el mensaje de error sea visible
        }
    };

    // 4. Función para cancelar una reserva
    const cancelarReserva = async (reservaId) => {
        if (!confirm('¿Estás seguro de que quieres cancelar esta reserva?')) return;
        
        try {
            const response = await fetch(`${API_URL}/${reservaId}`, { method: 'DELETE' });
            if (response.ok) {
                alert('Reserva cancelada exitosamente.');
                cargarMisReservas(); // Recargar la lista de reservas
            } else {
                throw new Error('No se pudo cancelar la reserva.');
            }
        } catch (error) {
            console.error('Error al cancelar reserva:', error);
            alert(`Error: ${error.message}`);
        }
    };

    // 5. Manejo de eventos para los botones de la tabla
    const tableContainer = document.querySelector('.table-responsive');
    if (tableContainer) {
        tableContainer.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (!button) return;
    
            const reservaId = button.dataset.id;
    
            if (button.classList.contains('btn-cancelar')) {
                cancelarReserva(reservaId);
            }
            if (button.classList.contains('btn-editar')) {
                window.location.href = `editar-reserva.html?id=${reservaId}`;
            }
        });
    }

    // 6. Carga inicial de las reservas
    cargarMisReservas();
}); 