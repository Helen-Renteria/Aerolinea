document.addEventListener('DOMContentLoaded', () => {
    const registerVuelo = document.querySelector('#formVuelo');
    registerVuelo.addEventListener('submit', async e => {
        e.preventDefault();
        const idvuelo = e.target.idvuelo.value;
        const numerovuelo = e.target.numerovuelo.value;
        const idavion = e.target.idavion.value;
        const origen = e.target.origen.value;
        const destino = e.target.destino.value;
        const fechasalida = e.target.fechasalida.value;
        const fechallegada = e.target.fechallegada.value;
        const estado = e.target.estado.value;

        try {
            //api/v1/vuelos/register
            const { data } = await axios.post('/api/v1/vuelos/register', {
                idvuelo, numerovuelo, idavion, origen, destino, fechasalida, fechallegada, estado
            });
            registerVuelo.reset();
            Swal.fire({
                icon: 'success',
                title: 'Vuelo registrado',
                text: 'El vuelo ha sido registrado exitosamente'
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
    async function loadVuelos() {
        try {
            const response = await axios.get('/api/v1/vuelos/list');
            const vuelos = response.data;
            const tableBody = document.getElementById('vuelosTbBd');
            tableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

            vuelos.forEach(vuelo => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${vuelo.idvuelo}</td>
                    <td>${vuelo.numerovuelo}</td>
                    <td>${vuelo.idavion}</td>
                    <td>${vuelo.origen}</td>
                    <td>${vuelo.destino}</td>
                    <td>${vuelo.fechasalida}</td>
                    <td>${vuelo.fechallegada}</td>
                    <td>${vuelo.estado}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="updateVuelo('${vuelo.idvuelo}')">Actualizar</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteVuelo('${vuelo.idvuelo}')">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error al cargar los vuelos:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al cargar los vuelos'
            });
        }
    }

    async function deleteVuelo(idvuelo) {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`/api/v1/vuelos/${idvuelo}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('Vuelo eliminado con éxito');
            Swal.fire({
                icon: 'success',
                title: 'Vuelo eliminado',
                text: 'El vuelo ha sido eliminado exitosamente'
            });
            loadVuelos(); // Recargar la lista de vuelos después de eliminar
        } catch (error) {
            console.error('Error al eliminar el vuelo:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Error al eliminar el vuelo'
            });
        }
    }

    async function updateVuelo(idvuelo) {
        const token = localStorage.getItem('token');
        const updateFields = {
            numerovuelo: prompt('Nuevo número de vuelo:'),
            idavion: prompt('Nuevo id de avión:'),
            origen: prompt('Nuevo origen:'),
            destino: prompt('Nuevo destino:'),
            fechasalida: prompt('Nueva fecha de salida:'),
            fechallegada: prompt('Nueva fecha de llegada:'),
            estado: prompt('Nuevo estado:')
        };

        try {
            const { data } = await axios.patch(`/api/v1/vuelos/${idvuelo}`, updateFields, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Vuelo actualizado con éxito');
            Swal.fire({
                icon: 'success',
                title: 'Vuelo actualizado',
                text: 'El vuelo ha sido actualizado exitosamente'
            });
            loadVuelos(); // Recargar la lista de vuelos después de actualizar
        } catch (error) {
            console.error('Error al actualizar el vuelo:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Error al actualizar el vuelo'
            });
        }
    }

    async function searchVuelo() {
        const searchInput = document.getElementById('searchInput').value;
        try {
            const response = await axios.get(`/api/v1/vuelos/search?query=${searchInput}`);
            const vuelos = response.data;
            if (!Array.isArray(vuelos)) {
                throw new Error('La respuesta no es un array');
            }
            const tableBody = document.getElementById('vuelosTbBd');
            tableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

            vuelos.forEach(vuelo => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${vuelo.idvuelo}</td>
                    <td>${vuelo.numerovuelo}</td>
                    <td>${vuelo.idavion}</td>
                    <td>${vuelo.origen}</td>
                    <td>${vuelo.destino}</td>
                    <td>${vuelo.fechasalida}</td>
                    <td>${vuelo.fechallegada}</td>
                    <td>${vuelo.estado}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="updateVuelo('${vuelo.idvuelo}')">Actualizar</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteVuelo('${vuelo.idvuelo}')">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error al buscar el vuelo:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al buscar el vuelo'
            });
        }
    }

    // Exponer las funciones globalmente para que puedan ser llamadas desde el HTML
    window.deleteVuelo = deleteVuelo;
    window.updateVuelo = updateVuelo;
    window.loadVuelos = loadVuelos;
    window.searchVuelo = searchVuelo;
});
