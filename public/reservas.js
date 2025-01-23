document.addEventListener('DOMContentLoaded', () => {
    const registerReserva = document.querySelector('#formReserva');
    registerReserva.addEventListener('submit', async e => {
        e.preventDefault();
        const idreserva = e.target.idreserva.value;
        const idcliente = e.target.idcliente.value;
        const idvuelo = e.target.idvuelo.value;
        const fechareserva = e.target.fechareserva.value;
        const clase = e.target.clase.value;
        const precio = e.target.precio.value;
        const estado = e.target.estado.value;

        try {
            // API de registro de reserva
            const { data } = await axios.post('/api/v1/reservas/register', {
                idreserva, idcliente, idvuelo, fechareserva, clase, precio, estado
            });
            registerReserva.reset();
            Swal.fire({
                icon: 'success',
                title: 'Reserva registrada',
                text: 'La reserva ha sido registrada exitosamente'
            });
        } catch (error) {
            if (error.response) {
                console.error('Error de respuesta del servidor:', error.response.data);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response.data.message || 'Error de respuesta del servidor'
                });
            } else if (error.request) {
                console.error('No se recibió respuesta del servidor:', error.request);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se recibió respuesta del servidor'
                });
            } else {
                console.error('Error al configurar la solicitud:', error.message);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al configurar la solicitud'
                });
            }
        }
    });

    // Obtener los datos de la DB para reservas
    async function loadReservas() {
        try {
            const response = await axios.get('/api/v1/reservas/list');
            const reservas = response.data;
            const tableBody = document.getElementById('reservasTbBd');
            tableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

            reservas.forEach(reserva => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${reserva.idreserva}</td>
                    <td>${reserva.idcliente}</td>
                    <td>${reserva.idvuelo}</td>
                    <td>${reserva.fechareserva}</td>
                    <td>${reserva.clase}</td>
                    <td>${reserva.precio}</td>
                    <td>${reserva.estado}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="updateReserva('${reserva.idreserva}')">Actualizar</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteReserva('${reserva.idreserva}')">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error al cargar las reservas:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al cargar las reservas'
            });
        }
    }

    async function deleteReserva(idreserva) {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`/api/v1/reservas/${idreserva}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Enviar el token en los encabezados de la solicitud
                }
            });

            console.log('Reserva eliminada con éxito');
            Swal.fire({
                icon: 'success',
                title: 'Reserva eliminada',
                text: 'La reserva ha sido eliminada exitosamente'
            });
            loadReservas(); // Recargar la lista de reservas después de eliminar
        } catch (error) {
            console.error('Error al eliminar la reserva:', error);
            alert('Error al eliminar la reserva');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Error al eliminar la reserva'
            });
        }
    }

    // Función para mostrar el formulario con los datos de la reserva a actualizar
    async function updateReserva(idreserva) {
        const token = localStorage.getItem('token');
        const updateFields = {
            idcliente: prompt('Nuevo id de cliente:'),
            idvuelo: prompt('Nuevo id de vuelo:'),
            fechareserva: prompt('Nueva fecha de reserva:'),
            clase: prompt('Nueva clase:'),
            precio: prompt('Nuevo precio:'),
            estado: prompt('Nuevo estado:')
        };

        try {
            const { data } = await axios.patch(`/api/v1/reservas/${idreserva}`, updateFields, {
                headers: {
                    Authorization: `Bearer ${token}` // Enviar el token en los encabezados de la solicitud
                }
            });
            console.log('Reserva actualizada con éxito');
            Swal.fire({
                icon: 'success',
                title: 'Reserva actualizada',
                text: 'La reserva ha sido actualizada exitosamente'
            });
            loadReservas(); // Recargar la lista de reservas después de actualizar
        } catch (error) {
            console.error('Error al actualizar la reserva:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Error al actualizar la reserva'
            });
        }
    }

    async function searchReserva() {
        const searchInput = document.getElementById('searchInput').value;
        try {
            const response = await axios.get(`/api/v1/reservas/search?query=${searchInput}`);
            const reservas = response.data;
            if (!Array.isArray(reservas)) {
                throw new Error('La respuesta no es un array');
            }
            const tableBody = document.getElementById('reservasTbBd');
            tableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

            reservas.forEach(reserva => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${reserva.idreserva}</td>
                    <td>${reserva.idcliente}</td>
                    <td>${reserva.idvuelo}</td>
                    <td>${reserva.fechareserva}</td>
                    <td>${reserva.clase}</td>
                    <td>${reserva.precio}</td>
                    <td>${reserva.estado}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="updateReserva('${reserva.idreserva}')">Actualizar</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteReserva('${reserva.idreserva}')">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error al buscar la reserva:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al buscar la reserva'
            });
        }
    }

    // Exponer las funciones globalmente para que puedan ser llamadas desde el HTML
    window.deleteReserva = deleteReserva;
    window.updateReserva = updateReserva;
    window.loadReservas = loadReservas;
    window.searchReserva = searchReserva;
});
