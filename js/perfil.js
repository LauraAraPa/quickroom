// js/perfil.js

document.addEventListener('DOMContentLoaded', () => {
    // Verificar si el usuario está logueado
    let usuarioActual = JSON.parse(localStorage.getItem('user'));
    if (!usuarioActual) {
        window.location.href = 'login.html';
        return;
    }

    // Elementos del DOM
    const nombreUsuario = document.getElementById('nombreUsuario');
    const nombre = document.getElementById('nombre');
    const identificacion = document.getElementById('identificacion');
    const celular = document.getElementById('celular');
    const email = document.getElementById('email');
    const pais = document.getElementById('pais');
    const btnEditar = document.getElementById('btnEditar');
    const btnGuardar = document.getElementById('btnGuardar');
    const btnEliminar = document.getElementById('btnEliminar');
    const btnMisReservas = document.getElementById('btnMisReservas');
    const formInputs = [nombre, celular, pais];

    // --- Lógica de visibilidad por rol ---
    if (usuarioActual.isAdmin) {
        if (btnMisReservas) {
            btnMisReservas.style.display = 'none';
        }
    }

    // Cargar datos del usuario
    function cargarDatosUsuario() {
        nombreUsuario.textContent = usuarioActual.nombre;
        nombre.value = usuarioActual.nombre;
        identificacion.value = usuarioActual.numeroIdentificacion;
        celular.value = usuarioActual.numeroCelular;
        email.value = usuarioActual.correoElectronico;
        pais.value = usuarioActual.pais;
    }

    // Habilitar edición
    function habilitarEdicion() {
        formInputs.forEach(input => input.readOnly = false);
        btnEditar.style.display = 'none';
        btnGuardar.style.display = 'block';
    }

    // Deshabilitar edición
    function deshabilitarEdicion() {
        formInputs.forEach(input => input.readOnly = true);
        btnEditar.style.display = 'block';
        btnGuardar.style.display = 'none';
    }

    // Guardar cambios
    async function guardarCambios() {
        btnGuardar.disabled = true;
        btnGuardar.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Guardando...`;

        try {
            const usuarioActualizado = {
                id: usuarioActual.id,
                nombre: nombre.value,
                numeroIdentificacion: usuarioActual.numeroIdentificacion,
                numeroCelular: celular.value,
                correoElectronico: usuarioActual.correoElectronico,
                pais: pais.value,
                // NOTA: Se recomienda no enviar la contraseña de esta manera.
                // Se mantiene por consistencia con la estructura de datos existente.
                contrasena: usuarioActual.contrasena,
                isAdmin: usuarioActual.isAdmin
            };

            const response = await fetch(`http://localhost:8080/api/usuarios/${usuarioActual.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(usuarioActualizado)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar el perfil.');
            }
            
            // Asumimos que la respuesta es el usuario actualizado
            const data = await response.json(); 
            localStorage.setItem('user', JSON.stringify(data));
            usuarioActual = data;
            
            Swal.fire({
                icon: 'success',
                title: '¡Guardado!',
                text: 'Perfil actualizado correctamente.',
                timer: 5000,
                showConfirmButton: false
            });
            deshabilitarEdicion();
            cargarDatosUsuario();

        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Error al guardar los cambios: ${error.message}`,
                timer: 5000,
                showConfirmButton: false
            });
        } finally {
            btnGuardar.disabled = false;
            btnGuardar.innerHTML = `<i class="bi bi-save"></i> Guardar Cambios`;
        }
    }

    // Eliminar perfil
    async function eliminarPerfil() {
        Swal.fire({
            title: '¿Está seguro que desea eliminar su perfil?',
            text: "¡Esta acción no se puede deshacer!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar mi perfil',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`http://localhost:8080/api/usuarios/${usuarioActual.id}`, {
                        method: 'DELETE'
                    });

                    if (!response.ok) {
                        throw new Error('Error al eliminar el perfil');
                    }

                    localStorage.removeItem('user');
                    await Swal.fire(
                        '¡Eliminado!',
                        'Tu perfil ha sido eliminado.',
                        'success'
                    );
                    window.location.href = 'index.html';

                } catch (error) {
                    console.error('Error:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: `Error al eliminar el perfil: ${error.message}`,
                        timer: 5000,
                        showConfirmButton: false
                    });
                }
            }
        });
    }

    // Event Listeners
    btnEditar.addEventListener('click', habilitarEdicion);
    btnGuardar.addEventListener('click', guardarCambios);
    btnEliminar.addEventListener('click', eliminarPerfil);

    // Cargar datos iniciales
    cargarDatosUsuario();
}); 