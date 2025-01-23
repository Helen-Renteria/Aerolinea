document.addEventListener('DOMContentLoaded', () => {
    const registerAvion = document.querySelector('#formAvion');
    registerAvion.addEventListener('submit', async (e) => {
        e.preventDefault();
        const idavion = e.target.idavion.value;
        const matricula = e.target.matricula.value;
        const modelo = e.target.modelo.value;
        const capacidad = e.target.capacidad.value;
        const aerolinea = e.target.aerolinea.value;

        try {
            const { data } = await axios.post('/api/v1/aviones/register', {
                idavion,
                matricula,
                modelo,
                capacidad,
                aerolinea,
            });
            registerAvion.reset();
            Swal.fire({
                icon: 'success',
                title: 'Avión registrado',
                text: 'El avión ha sido registrado exitosamente',
            });
        } catch (error) {
            handleError(error, 'registrar el avión');
        }
    });

    async function loadAviones() {
        try {
            const response = await axios.get('/api/v1/aviones/list');
            const aviones = response.data;
            const tableBody = document.getElementById('avionesTbBd');
            tableBody.innerHTML = '';

            aviones.forEach((avion) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${avion.idavion}</td>
                    <td>${avion.matricula}</td>
                    <td>${avion.modelo}</td>
                    <td>${avion.capacidad}</td>
                    <td>${avion.aerolinea}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="updateAvion('${avion.idavion}')">Actualizar</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteAvion('${avion.idavion}')">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            handleError(error, 'cargar los aviones');
        }
    }

    async function deleteAvion(idavion) {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`/api/v1/aviones/${idavion}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            Swal.fire({
                icon: 'success',
                title: 'Avión eliminado',
                text: 'El avión ha sido eliminado exitosamente',
            });
            loadAviones();
        } catch (error) {
            handleError(error, 'eliminar el avión');
        }
    }

    async function updateAvion(idavion) {
        const token = localStorage.getItem('token');
        const updateFields = {
            matricula: prompt('Nueva matrícula:'),
            modelo: prompt('Nuevo modelo:'),
            capacidad: prompt('Nueva capacidad:'),
            aerolinea: prompt('Nueva aerolínea:'),
        };

        try {
            const { data } = await axios.patch(`/api/v1/aviones/${idavion}`, updateFields, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            Swal.fire({
                icon: 'success',
                title: 'Avión actualizado',
                text: 'El avión ha sido actualizado exitosamente',
            });
            loadAviones();
        } catch (error) {
            handleError(error, 'actualizar el avión');
        }
    }

    async function searchAvion() {
        const searchInput = document.getElementById('searchInput').value;
        try {
            const response = await axios.get(`/api/v1/aviones/search?query=${searchInput}`);
            const aviones = response.data;
            if (!Array.isArray(aviones)) {
                throw new Error('La respuesta no es un array');
            }
            const tableBody = document.getElementById('avionesTbBd');
            tableBody.innerHTML = '';

            aviones.forEach((avion) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${avion.idavion}</td>
                    <td>${avion.matricula}</td>
                    <td>${avion.modelo}</td>
                    <td>${avion.capacidad}</td>
                    <td>${avion.aerolinea}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="updateAvion('${avion.idavion}')">Actualizar</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteAvion('${avion.idavion}')">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            handleError(error, 'buscar el avión');
        }
    }

    function handleError(error, action) {
        if (error.response) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response.data.message || `Error al ${action}`,
            });
        } else if (error.request) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `No se recibió respuesta del servidor al ${action}`,
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Error al configurar la solicitud para ${action}`,
            });
        }
    }

    // Exponer las funciones globalmente para que puedan ser llamadas desde el HTML
    window.deleteAvion = deleteAvion;
    window.updateAvion = updateAvion;
    window.loadAviones = loadAviones;
    window.searchAvion = searchAvion;
});
