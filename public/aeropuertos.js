document.addEventListener('DOMContentLoaded', () => {
    const registerAeropuerto = document.querySelector('#formAeropuerto');
    registerAeropuerto.addEventListener('submit', async e => {
        e.preventDefault();
        const idaeropuerto = e.target.idaeropuerto.value;
        const nombre = e.target.nombre.value;
        const ciudad = e.target.ciudad.value;
        const pais = e.target.pais.value;
        const codigoiata = e.target.codigoiata.value;

        try {
            const { data } = await axios.post('/api/v1/aeropuertos/register', {
                idaeropuerto, nombre, ciudad, pais, codigoiata
            });
            registerAeropuerto.reset();
            Swal.fire({
                icon: 'success',
                title: 'Aeropuerto registrado',
                text: 'El aeropuerto ha sido registrado exitosamente'
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

    // Obtener los datos de la DB 
    async function loadAeropuertos() {
        try {
            const response = await axios.get('/api/v1/aeropuertos/list');
            const aeropuertos = response.data;
            const tableBody = document.getElementById('aeropuertosTbBd');
            tableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

            aeropuertos.forEach(aeropuerto => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${aeropuerto.idaeropuerto}</td>
                    <td>${aeropuerto.nombre}</td>
                    <td>${aeropuerto.ciudad}</td>
                    <td>${aeropuerto.pais}</td>
                    <td>${aeropuerto.codigoiata}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="updateAeropuerto('${aeropuerto.idaeropuerto}')">Actualizar</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteAeropuerto('${aeropuerto.idaeropuerto}')">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error al cargar los aeropuertos:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al cargar los aeropuertos'
            });
        }
    }

    async function deleteAeropuerto(idaeropuerto) {
        const token = localStorage.getItem('token');
        console.log(token);
        try {
            await axios.delete(`/api/v1/aeropuertos/${idaeropuerto}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Enviar el token en los encabezados de la solicitud
                }
            });

            console.log('Aeropuerto eliminado con éxito');
            Swal.fire({
                icon: 'success',
                title: 'Aeropuerto eliminado',
                text: 'El aeropuerto ha sido eliminado exitosamente'
            });
            loadAeropuertos(); // Recargar la lista de aeropuertos después de eliminar
        } catch (error) {
            console.error('Error al eliminar el aeropuerto:', error);
            alert('Error al eliminar el aeropuerto');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Error al eliminar el aeropuerto'
            });
        }
    }

    // Función para mostrar el formulario con los datos del aeropuerto a actualizar
    async function updateAeropuerto(idaeropuerto) {
        const token = localStorage.getItem('token');
        const updateFields = {
            nombre: prompt('Nuevo nombre del aeropuerto:'),
            ciudad: prompt('Nueva ciudad:'),
            pais: prompt('Nuevo país:'),
            codigoiata: prompt('Nuevo código IATA:')
        };

        try {
            const { data } = await axios.patch(`/api/v1/aeropuertos/${idaeropuerto}`, updateFields, {
                headers: {
                    Authorization: `Bearer ${token}` // Enviar el token en los encabezados de la solicitud
                }
            });
            console.log('Aeropuerto actualizado con éxito');
            Swal.fire({
                icon: 'success',
                title: 'Aeropuerto actualizado',
                text: 'El aeropuerto ha sido actualizado exitosamente'
            });
            loadAeropuertos(); // Recargar la lista de aeropuertos después de actualizar
        } catch (error) {
            console.error('Error al actualizar el aeropuerto:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Error al actualizar el aeropuerto'
            });
        }
    }

    async function searchAeropuerto() {
        const searchInput = document.getElementById('searchInput').value;
        try {
            const response = await axios.get(`/api/v1/aeropuertos/search?query=${searchInput}`);
            const aeropuertos = response.data;
            if (!Array.isArray(aeropuertos)) {
                throw new Error('La respuesta no es un array');
            }
            const tableBody = document.getElementById('aeropuertosTbBd');
            tableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

            aeropuertos.forEach(aeropuerto => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${aeropuerto.idaeropuerto}</td>
                    <td>${aeropuerto.nombre}</td>
                    <td>${aeropuerto.ciudad}</td>
                    <td>${aeropuerto.pais}</td>
                    <td>${aeropuerto.codigoiata}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="updateAeropuerto('${aeropuerto.idaeropuerto}')">Actualizar</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteAeropuerto('${aeropuerto.idaeropuerto}')">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error al buscar el aeropuerto:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al buscar el aeropuerto'
            });
        }
    }

    // Exponer las funciones globalmente para que puedan ser llamadas desde el HTML
    window.deleteAeropuerto = deleteAeropuerto;
    window.updateAeropuerto = updateAeropuerto;
    window.loadAeropuertos = loadAeropuertos;
    window.searchAeropuerto = searchAeropuerto;
});
