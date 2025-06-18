document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('contrasena');
            const submitButton = loginForm.querySelector('button[type="submit"]');
            const alertPlaceholder = document.getElementById('alert-placeholder');
            
            const originalButtonText = submitButton.innerHTML;
            
            submitButton.disabled = true;
            submitButton.innerHTML = `
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Verificando...
            `;
            alertPlaceholder.innerHTML = '';

            try {
                // ADVERTENCIA: Lógica de login insegura. Obtiene todos los usuarios.
                const response = await fetch('http://localhost:8080/api/usuarios');

                if (!response.ok) {
                    throw new Error('No se pudo conectar con el servidor para verificar los usuarios.');
                }

                const usuarios = await response.json();
                
                const usuarioValido = usuarios.find(u => 
                    u.correoElectronico === emailInput.value && u.contrasena === passwordInput.value
                );

                if (usuarioValido) {
                    // Login exitoso. Se guarda en localStorage con la clave 'user' para consistencia.
                    localStorage.setItem('user', JSON.stringify(usuarioValido));
                    
                    const habitacionReserva = sessionStorage.getItem('habitacionReserva');
                    const fechaEntrada = sessionStorage.getItem('fechaEntrada');
                    const fechaSalida = sessionStorage.getItem('fechaSalida');

                    if (habitacionReserva && fechaEntrada && fechaSalida) {
                        sessionStorage.removeItem('habitacionReserva');
                        sessionStorage.removeItem('fechaEntrada');
                        sessionStorage.removeItem('fechaSalida');
                        window.location.href = `reservas.html?habitacion=${habitacionReserva}&check-in=${fechaEntrada}&check-out=${fechaSalida}`;
                    } else {
                        window.location.href = 'index.html';
                    }
                } else {
                    throw new Error('Correo o contraseña incorrectos.');
                }

            } catch (error) {
                alertPlaceholder.innerHTML = `
                    <div class="alert alert-danger" role="alert">
                        ${error.message}
                    </div>
                `;
            } finally {
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            }
        });
    }
}); 