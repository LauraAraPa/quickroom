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

    // --- Lógica de inicialización ---
    const initializeForm = async () => {
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
                descripcionInput.value = habitacion.descripcion;

            } catch (error) {
                alert(`Error al cargar los datos: ${error.message}`);
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
            descripcion: descripcionInput.value
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

            alert(`Habitación ${isEditMode ? 'actualizada' : 'creada'} correctamente.`);
            window.location.href = 'habitaciones.html';

        } catch (error) {
            alert(`Error: ${error.message}`);
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });

    initializeForm();
}); 