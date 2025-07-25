document.addEventListener('DOMContentLoaded', () => {
    // --- Verificación de rol de Admin ---
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.isAdmin) {
        alert('Acceso denegado. Esta sección es solo para administradores.');
        window.location.href = 'habitaciones.html';
        return;
    }

    // --- Elementos del DOM y variables ---
    const form = document.getElementById('habitacion-form');
    const formTitle = document.getElementById('form-title');
    const submitButton = document.getElementById('submit-button');
    const API_URL = 'http://localhost:8081/api/habitaciones';
    
    const urlParams = new URLSearchParams(window.location.search);
    const habitacionId = urlParams.get('id');
    const isEditMode = habitacionId !== null;

    const tipoHabitacionInput = document.getElementById('tipo_habitacion');
    const numCamasInput = document.getElementById('numero_de_camas');
    const tipoCamaInput = document.getElementById('tipo_de_cama');
    const precioInput = document.getElementById('precio_habitacion');
    const descripcionInput = document.getElementById('descripcion');
    const disponibleInput = document.getElementById('disponible');
    const imagenUrlInput = document.getElementById('imagen_url');

    // --- Lógica de inicialización ---
    const initializeForm = async () => {
        if (!currentUser || !currentUser.isAdmin) {
            Swal.fire({
                icon: 'error',
                title: 'Acceso Denegado',
                text: 'Esta sección es solo para administradores.',
                timer: 5000,
                showConfirmButton: false,
            }).then(() => {
                window.location.href = 'habitaciones.html';
            });
            return;
        }

        if (isEditMode) {
            formTitle.textContent = 'Editar Habitación';
            try {
                const response = await fetch(`${API_URL}/${habitacionId}`);
                if (!response.ok) throw new Error('No se encontraron datos para esta habitación.');
                
                const habitacion = await response.json();
                tipoHabitacionInput.value = habitacion.tipo_habitacion;
                numCamasInput.value = habitacion.numero_de_camas;
                tipoCamaInput.value = habitacion.tipo_de_cama;
                precioInput.value = habitacion.precio_habitacion;
                descripcionInput.value = habitacion.descripcion || '';
                disponibleInput.checked = habitacion.disponible;

            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al cargar',
                    text: error.message,
                    timer: 5000,
                    showConfirmButton: false
                });
                window.location.href = 'habitaciones.html';
            }
        }
    };

    // --- Manejo del envío del formulario ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Guardando...`;
        
        const habitacionData = {
            tipo_habitacion: tipoHabitacionInput.value,
            numero_de_camas: parseInt(numCamasInput.value, 10),
            tipo_de_cama: tipoCamaInput.value,
            precio_habitacion: parseFloat(precioInput.value),
            descripcion: descripcionInput.value,
            disponible: disponibleInput.checked
        };

        try {
            const method = isEditMode ? 'PUT' : 'POST';
            const url = isEditMode ? `${API_URL}/${habitacionId}` : API_URL;

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(habitacionData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ocurrió un error al guardar la habitación.');
            }

            const successMsg = isEditMode ? 'Habitación actualizada correctamente.' : 'Habitación creada correctamente.';
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: successMsg,
            }).then(() => {
                window.location.href = 'habitaciones.html';
            });

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error al guardar',
                text: error.message,
                timer: 5000,
                showConfirmButton: false
            });
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });

    initializeForm();
}); 