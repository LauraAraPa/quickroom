document.addEventListener('DOMContentLoaded', () => {
    const registroForm = document.getElementById('registroForm');
    
    // Función para mostrar mensajes de error
    function mostrarError(mensaje) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger alert-dismissible fade show';
        alertDiv.innerHTML = `
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        registroForm.insertBefore(alertDiv, registroForm.firstChild);
    }

    // Función para validar el formulario
    function validarFormulario() {
        const nombre = document.getElementById('nombre').value.trim();
        const identificacion = document.getElementById('identificacion').value.trim();
        const celular = document.getElementById('celular').value.trim();
        const email = document.getElementById('email').value.trim();
        const contrasena = document.getElementById('contrasena').value;
        const pais = document.getElementById('pais').value;

        if (!nombre || !identificacion || !celular || !email || !contrasena || !pais) {
            mostrarError('Por favor, completa todos los campos requeridos.');
            return false;
        }

        if (contrasena.length < 6) {
            mostrarError('La contraseña debe tener al menos 6 caracteres.');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            mostrarError('Por favor, ingresa un correo electrónico válido.');
            return false;
        }

        return true;
    }

    registroForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Limpiar mensajes de error anteriores
        const alertas = registroForm.querySelectorAll('.alert');
        alertas.forEach(alerta => alerta.remove());
        
        // Validar el formulario
        if (!validarFormulario()) {
            return;
        }
        
        // Obtener los valores del formulario
        const nombre = document.getElementById('nombre').value.trim();
        const identificacion = document.getElementById('identificacion').value.trim();
        const celular = document.getElementById('celular').value.trim();
        const email = document.getElementById('email').value.trim();
        const contrasena = document.getElementById('contrasena').value;
        const pais = document.getElementById('pais').value;
        
        try {
            const response = await fetch('http://localhost:8080/api/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre,
                    numeroIdentificacion: identificacion,
                    numeroCelular: celular,
                    correoElectronico: email,
                    contrasena,
                    pais
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Guardar el token y los datos del usuario
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.usuario));
                
                // Verificar si hay una habitación pendiente de reserva
                const habitacionReserva = sessionStorage.getItem('habitacionReserva');
                const fechaEntrada = sessionStorage.getItem('fechaEntrada');
                const fechaSalida = sessionStorage.getItem('fechaSalida');
                
                if (habitacionReserva) {
                    // Limpiar el sessionStorage
                    sessionStorage.removeItem('habitacionReserva');
                    sessionStorage.removeItem('fechaEntrada');
                    sessionStorage.removeItem('fechaSalida');
                    
                    // Redirigir a la página de reservas con todos los parámetros
                    window.location.href = `reservas.html?habitacion=${habitacionReserva}&check-in=${fechaEntrada}&check-out=${fechaSalida}`;
                } else {
                    // Redirigir al inicio
                    window.location.href = 'index.html';
                }
            } else {
                mostrarError(data.mensaje || 'Error al registrar usuario. Por favor, intenta de nuevo.');
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarError('Error al conectar con el servidor. Por favor, intenta de nuevo.');
        }
    });
}); 