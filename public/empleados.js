document.addEventListener('DOMContentLoaded', () => {
    const registerEmployee = document.querySelector('#formEmpleado');

    // Registrar un nuevo empleado
    registerEmployee.addEventListener('submit', async (e) => {
        e.preventDefault();
        const idempleado = e.target.idempleado.value;
        const nombre = e.target.nombre.value;
        const apellido = e.target.apellido.value;
        const cargo = e.target.cargo.value;
        const idvuelo = e.target.idvuelo.value;
        const telefono = e.target.telefono.value;

        try {
            const { data } = await axios.post('/api/v1/empleados/register', {
                idempleado, nombre, apellido, cargo, idvuelo, telefono
            });
            registerEmployee.reset();
            Swal.fire({
                icon: 'success',
                title: 'Empleado registrado',
                text: 'El empleado ha sido registrado exitosamente'
            });
        } catch (error) {
            handleApiError(error, 'registrar el empleado');
        }
    });

    // Cargar empleados desde la base de datos
    async function loadEmpleados() {
        try {
            const response = await axios.get('/api/v1/empleados/list');
            const empleados = response.data;
            const tableBody = document.getElementById('empleadosTbBd');
            tableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

            empleados.forEach(empleado => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${empleado.idempleado}</td>
                    <td>${empleado.nombre}</td>
                    <td>${empleado.apellido}</td>
                    <td>${empleado.cargo}</td>
                    <td>${empleado.idvuelo}</td>
                    <td>${empleado.telefono}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="updateEmpleado('${empleado.idempleado}')">Actualizar</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteEmpleado('${empleado.idempleado}')">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            handleApiError(error, 'cargar los empleados');
        }
    }

    // Eliminar empleado
    async function deleteEmpleado(idempleado) {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`/api/v1/empleados/${idempleado}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            Swal.fire({
                icon: 'success',
                title: 'Empleado eliminado',
                text: 'El empleado ha sido eliminado exitosamente'
            });
            loadEmpleados();
        } catch (error) {
            handleApiError(error, 'eliminar el empleado');
        }
    }

    // Actualizar empleado
    async function updateEmpleado(idempleado) {
        const token = localStorage.getItem('token');
        const updateFields = {
            nombre: prompt('Nuevo nombre:'),
            apellido: prompt('Nuevo apellido:'),
            cargo: prompt('Nuevo cargo:'),
            idvuelo: prompt('Nuevo ID de vuelo:'),
            telefono: prompt('Nuevo teléfono:')
        };

        try {
            await axios.patch(`/api/v1/empleados/${idempleado}`, updateFields, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            Swal.fire({
                icon: 'success',
                title: 'Empleado actualizado',
                text: 'El empleado ha sido actualizado exitosamente'
            });
            loadEmpleados();
        } catch (error) {
            handleApiError(error, 'actualizar el empleado');
        }
    }

    // Buscar empleado
    async function searchEmpleado() {
        const searchInput = document.getElementById('searchInput').value;
        try {
            const response = await axios.get(`/api/v1/empleados/search?query=${searchInput}`);
            const empleados = response.data;
            const tableBody = document.getElementById('empleadosTbBd');
            tableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

            empleados.forEach(empleado => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${empleado.idempleado}</td>
                    <td>${empleado.nombre}</td>
                    <td>${empleado.apellido}</td>
                    <td>${empleado.cargo}</td>
                    <td>${empleado.idvuelo}</td>
                    <td>${empleado.telefono}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="updateEmpleado('${empleado.idempleado}')">Actualizar</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteEmpleado('${empleado.idempleado}')">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            handleApiError(error, 'buscar el empleado');
        }
    }

    // Manejo de errores
    function handleApiError(error, action) {
        if (error.response) {
            console.error(`Error de respuesta al ${action}:`, error.response.data);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response.data.message || `Error de respuesta al ${action}`
            });
        } else if (error.request) {
            console.error(`No se recibió respuesta del servidor al ${action}:`, error.request);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `No se recibió respuesta del servidor al ${action}`
            });
        } else {
            console.error(`Error al configurar la solicitud para ${action}:`, error.message);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Error al configurar la solicitud para ${action}`
            });
        }
    }

    // Exponer funciones globalmente
    window.loadEmpleados = loadEmpleados;
    window.deleteEmpleado = deleteEmpleado;
    window.updateEmpleado = updateEmpleado;
    window.searchEmpleado = searchEmpleado;

});
