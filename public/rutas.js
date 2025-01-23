document.addEventListener('DOMContentLoaded', () => {
    const registerRuta = document.querySelector('#formRuta');
    registerRuta.addEventListener('submit', async e => {
        e.preventDefault();
        const idruta = e.target.idruta.value;
        const origen = e.target.origen.value;
        const destino = e.target.destino.value;
        const distancia = e.target.distancia.value;

        try {
            // API para registrar la ruta
            const { data } = await axios.post('/api/v1/rutas/register', {
                idruta, origen, destino, distancia
            });
            registerRuta.reset();
            Swal.fire({
                icon: 'success',
                title: 'Ruta registrada',
                text: 'La ruta ha sido registrada exitosamente'
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

    // Obtener los datos de las rutas desde la base de datos
    async function loadRutas() {
        try {
            const response = await axios.get('/api/v1/rutas/list');
            const rutas = response.data;
            const tableBody = document.getElementById('rutasTbBd');
            tableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

            rutas.forEach(ruta => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${ruta.idruta}</td>
                    <td>${ruta.origen}</td>
                    <td>${ruta.destino}</td>
                    <td>${ruta.distancia}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="updateRuta('${ruta.idruta}')">Actualizar</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteRuta('${ruta.idruta}')">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error al cargar las rutas:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al cargar las rutas'
            });
        }
    }

    // Eliminar una ruta
    async function deleteRuta(idruta) {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`/api/v1/rutas/${idruta}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Enviar el token en los encabezados de la solicitud
                }
            });

            console.log('Ruta eliminada con éxito');
            Swal.fire({
                icon: 'success',
                title: 'Ruta eliminada',
                text: 'La ruta ha sido eliminada exitosamente'
            });
            loadRutas(); // Recargar la lista de rutas después de eliminar
        } catch (error) {
            console.error('Error al eliminar la ruta:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Error al eliminar la ruta'
            });
        }
    }

    // Función para mostrar el formulario con los datos de la ruta a actualizar
    async function updateRuta(idruta) {
        const token = localStorage.getItem('token');
        const updateFields = {
            origen: prompt('Nuevo origen:'),
            destino: prompt('Nuevo destino:'),
            distancia: prompt('Nueva distancia:')
        };

        try {
            const { data } = await axios.patch(`/api/v1/rutas/${idruta}`, updateFields, {
                headers: {
                    Authorization: `Bearer ${token}` // Enviar el token en los encabezados de la solicitud
                }
            });
            console.log('Ruta actualizada con éxito');
            Swal.fire({
                icon: 'success',
                title: 'Ruta actualizada',
                text: 'La ruta ha sido actualizada exitosamente'
            });
            loadRutas(); // Recargar la lista de rutas después de actualizar
        } catch (error) {
            console.error('Error al actualizar la ruta:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Error al actualizar la ruta'
            });
        }
    }

    // Función para buscar una ruta
    async function searchRuta() {
        const searchInput = document.getElementById('searchInput').value;
        try {
            const response = await axios.get(`/api/v1/rutas/search?query=${searchInput}`);
            const rutas = response.data;
            if (!Array.isArray(rutas)) {
                throw new Error('La respuesta no es un array');
            }
            const tableBody = document.getElementById('rutasTbBd');
            tableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

            rutas.forEach(ruta => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${ruta.idruta}</td>
                    <td>${ruta.origen}</td>
                    <td>${ruta.destino}</td>
                    <td>${ruta.distancia}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="updateRuta('${ruta.idruta}')">Actualizar</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteRuta('${ruta.idruta}')">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error al buscar la ruta:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al buscar la ruta'
            });
        }
    }

    // Exponer las funciones globalmente para que puedan ser llamadas desde el HTML
    window.deleteRuta = deleteRuta;
    window.updateRuta = updateRuta;
    window.loadRutas = loadRutas;
    window.searchRuta = searchRuta;
});
