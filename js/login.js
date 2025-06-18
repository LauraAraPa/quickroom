document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('contrasena');
        const submitButton = loginForm.querySelector('button[type="submit"]');
        const alertPlaceholder = document.getElementById('alert-placeholder');

        const originalButtonText = submitButton.innerHTML;
        
        // Deshabilitar botón y mostrar estado de carga
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Verificando...
        `;
        alertPlaceholder.innerHTML = '';

        try {
            const response = await fetch('http://localhost:8080/api/usuarios/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    correoElectronico: emailInput.value, 
                    contrasena: passwordInput.value 
                })
            });

            if (response.ok) {
                const usuario = await response.json();
                localStorage.setItem('user', JSON.stringify(usuario));

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
                const errorData = await response.json();
                throw new Error(errorData.message || 'Credenciales inválidas. Intente de nuevo.');
            }
        } catch (error) {
            alertPlaceholder.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    ${error.message}
                </div>
            `;
        } finally {
            // Restaurar botón
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });
}); 