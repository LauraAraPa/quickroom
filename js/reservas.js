document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(localStorage.getItem('user'));

    if (!currentUser) {
        alert('Debes iniciar sesión para poder reservar.');
        // Guardar la intención de reserva para redirigir después del login
        const params = new URLSearchParams(window.location.search);
        const habitacionId = params.get('habitacion');
        const checkIn = params.get('check-in');
        const checkOut = params.get('check-out');
        
        if (habitacionId && checkIn && checkOut) {
            sessionStorage.setItem('habitacionReserva', habitacionId);
            sessionStorage.setItem('fechaEntrada', checkIn);
            sessionStorage.setItem('fechaSalida', checkOut);
        }
        window.location.href = 'login.html';
        return;
    }

    // API URL
    const API_URL_RESERVAS = "http://localhost:8083/api/reservas";

    // Elementos del formulario
    const formReserva = document.getElementById("formReserva");
    const idHabitacionInput = document.getElementById("idHabitacion");
    const nombreCompletoInput = document.getElementById("nombreCompleto");
    const emailInput = document.getElementById("email");
    const cedulaInput = document.getElementById("cedula");
    const celularInput = document.getElementById("celular");
    const fechaEntradaInput = document.getElementById("fechaEntrada");
    const fechaSalidaInput = document.getElementById("fechaSalida");
    const numeroPersonasInput = document.getElementById("numeroPersonas");
    const submitButton = formReserva.querySelector('button[type="submit"]');

    // Obtener parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    const habitacionId = params.get('habitacion');
    const checkIn = params.get('check-in');
    const checkOut = params.get('check-out');

    // Autocompletar el formulario
    if (habitacionId) idHabitacionInput.value = habitacionId;
    if (checkIn) fechaEntradaInput.value = checkIn;
    if (checkOut) fechaSalidaInput.value = checkOut;
    
    nombreCompletoInput.value = currentUser.nombre;
    emailInput.value = currentUser.correoElectronico;
    cedulaInput.value = currentUser.numeroIdentificacion;
    celularInput.value = currentUser.numeroCelular;

    // Lógica para el envío del formulario
    formReserva.addEventListener("submit", async function(e) {
        e.preventDefault();
        
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Creando...`;

        // Corregido: Se elimina el campo 'id' para que el backend lo genere automáticamente.
        const nuevaReserva = {
            idUsuario: currentUser.id,
            idHabitacion: parseInt(idHabitacionInput.value, 10),
            fechaEntrada: fechaEntradaInput.value,
            fechaSalida: fechaSalidaInput.value,
            numeroPersonas: parseInt(numeroPersonasInput.value, 10)
        };
        
        console.log("Enviando al backend:", nuevaReserva);

        if (new Date(nuevaReserva.fechaSalida) <= new Date(nuevaReserva.fechaEntrada)) {
            alert('La fecha de salida debe ser posterior a la fecha de entrada.');
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
            return;
        }

        try {
            const response = await fetch(API_URL_RESERVAS, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevaReserva)
            });

            if (response.ok) {
                await showAlert('Reserva Exitosa', 'Tu reserva ha sido creada con éxito.', 'success');
                window.location.href = 'mis-reservas.html';
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'No se pudo crear la reserva.');
            }

        } catch (error) {
            console.error('Error al crear la reserva:', error);
            showNotification(error.message, 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Confirmar y Pagar';
        }
    });
});

// Función para mostrar alertas usando SweetAlert2
function showAlert(title, text, icon = 'info') {
    return Swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonText: 'OK'
    });
}

// Función para mostrar notificaciones de error usando SweetAlert2
function showNotification(message, type = 'info') {
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: type,
        title: message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
    });
}