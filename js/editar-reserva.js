document.addEventListener('DOMContentLoaded', () => {
    // Proteger la ruta
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    const API_URL_RESERVAS = 'http://localhost:8083/api/reservas';
    const API_URL_HABITACIONES = 'http://localhost:8081/api/habitaciones';

    const form = document.getElementById('form-editar-reserva');
    const params = new URLSearchParams(window.location.search);
    const reservaId = params.get('id');

    if (!reservaId) {
        alert('No se ha especificado una reserva para editar.');
        window.location.href = 'mis-reservas.html';
        return;
    }

    // Cargar datos de la reserva en el formulario
    const cargarDatosReserva = async () => {
        try {
            const response = await fetch(`${API_URL_RESERVAS}/${reservaId}`);
            if (!response.ok) throw new Error('No se pudo cargar la reserva.');
            const reserva = await response.json();

            // Verificar que el usuario actual es el dueño de la reserva
            const currentUser = getCurrentUser();
            if (reserva.idUsuario !== currentUser.id) {
                alert('No tienes permiso para editar esta reserva.');
                window.location.href = 'mis-reservas.html';
                return;
            }

            // Cargar info de la habitación
            const resHabitacion = await fetch(`${API_URL_HABITACIONES}/${reserva.idHabitacion}`);
            const habitacion = resHabitacion.ok ? await resHabitacion.json() : null;

            // Rellenar el formulario
            document.getElementById('reservaId').value = reserva.id;
            document.getElementById('idUsuario').value = reserva.idUsuario;
            document.getElementById('idHabitacion').value = reserva.idHabitacion;
            document.getElementById('habitacion-info').value = habitacion ? `${habitacion.tipo_habitacion} - Capacidad: ${habitacion.capacidad}` : 'Información no disponible';
            document.getElementById('fechaEntrada').value = reserva.fechaEntrada.split('T')[0];
            document.getElementById('fechaSalida').value = reserva.fechaSalida.split('T')[0];
            document.getElementById('numeroPersonas').value = reserva.numeroPersonas;

        } catch (error) {
            console.error('Error cargando datos de la reserva:', error);
            alert('Error al cargar la información para editar.');
        }
    };

    // Manejar el envío del formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const datosActualizados = {
            id: document.getElementById('reservaId').value,
            idUsuario: document.getElementById('idUsuario').value,
            idHabitacion: document.getElementById('idHabitacion').value,
            fechaEntrada: document.getElementById('fechaEntrada').value,
            fechaSalida: document.getElementById('fechaSalida').value,
            numeroPersonas: document.getElementById('numeroPersonas').value,
        };

        try {
            const response = await fetch(`${API_URL_RESERVAS}/${reservaId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosActualizados)
            });

            if (response.ok) {
                alert('Reserva actualizada correctamente.');
                window.location.href = 'mis-reservas.html';
            } else {
                alert('No se pudo actualizar la reserva.');
            }
        } catch (error) {
            console.error('Error al actualizar la reserva:', error);
            alert('Error de conexión al guardar los cambios.');
        }
    });

    // Carga inicial
    cargarDatosReserva();
}); 