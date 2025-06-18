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

        // Corregido: El campo esperado por el backend es 'habitacion', no 'idHabitacion'.
        const nuevaReserva = {
            idUsuario: currentUser.id,
            habitacion: parseInt(idHabitacionInput.value, 10),
            fechaEntrada: fechaEntradaInput.value,
            fechaSalida: fechaSalidaInput.value,
            numeroPersonas: parseInt(numeroPersonasInput.value, 10)
        };
        
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
                alert("¡Reserva creada exitosamente!");
                window.location.href = 'mis-reservas.html';
            } else {
                const errorData = await response.text(); // Usar .text() por si el error no es JSON
                alert(`Error al crear la reserva: ${errorData || 'Intenta de nuevo.'}`);
            }
        } catch (error) {
            console.error("Error al crear la reserva:", error);
            alert("Error de conexión al intentar crear la reserva.");
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });
});