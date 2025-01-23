document.addEventListener('DOMContentLoaded', () => {
const resgisterClient = document.querySelector('#formCliente')
resgisterClient.addEventListener('submit', async e => {
    e.preventDefault();
    const idcliente = e.target.idcliente.value;
    const nombre = e.target.nombre.value;
    const apellido = e.target.apellido.value;
    const correo = e.target.correo.value;
    const telefono = e.target.telefono.value;
    const pasaporte = e.target.pasaporte.value;
    const direccion = e.target.direccion.value;

    try {//api/v1/clientes/register
        const { data } = await axios.post('/api/v1/clientes/register', {
            idcliente, nombre, apellido, correo, telefono, pasaporte, direccion
        });
    resgisterClient.reset();
    Swal.fire({
        icon: 'success',
        title: 'Cliente registrado',
        text: 'El cliente ha sido registrado exitosamente'
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

//Obtener los datos de la DB 
async function loadClientes() {
    try {
        const response = await axios.get('/api/v1/clientes/list');
        const clientes = response.data;
        const tableBody = document.getElementById('clientesTbBd');
        tableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

        clientes.forEach(cliente => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cliente.idcliente}</td>
                <td>${cliente.nombre}</td>
                <td>${cliente.apellido}</td>
                <td>${cliente.correo}</td>
                <td>${cliente.telefono}</td>
                <td>${cliente.pasaporte}</td>
                <td>${cliente.direccion}</td>
                
                <td>
                    <button class="btn btn-warning btn-sm" onclick="updateCliente('${cliente.idcliente}')">Actualizar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteCliente('${cliente.idcliente}')">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar los clientes:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al cargar los clientes'
        });
    }
}
async function deleteCliente(idcliente) {
    const token = localStorage.getItem('token');
    console.log(token);
    try {
        await axios.delete(`/api/v1/clientes/${idcliente}`, {
            headers: {
                Authorization: `Bearer ${token}`// Enviar el token en los encabezados de la solicitud
            }
            
        });

        console.log('Cliente eliminado con éxito');
        Swal.fire({
            icon: 'success',
            title: 'Cliente eliminado',
            text: 'El cliente ha sido eliminado exitosamente'
        });
        loadClientes(); // Recargar la lista de clientes después de eliminar
    } catch (error) {
        console.error('Error al eliminar el cliente:', error);
        alert('Error al eliminar el Cliente');
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Error al eliminar el cliente'
        });
    }
}

// Función para mostrar el formulario con los datos del cliente a actualizar
async function updateCliente(idcliente) {
    const token = localStorage.getItem('token');
    const updateFields = {
        nombre: prompt('Nuevo nombre:'),
        apellido: prompt('Nuevo apellido:'),
        correo: prompt('Nuevo correo electrónico:'),
        telefono: prompt('Nuevo teléfono '),
        pasaporte: prompt('Nuevo pasaporte'),
        direccion: prompt('Nueva direccion')
        
    };

    try {
        const { data } = await axios.patch(`/api/v1/clientes/${idcliente}`, updateFields, {
            headers: {
                Authorization: `Bearer ${token}` // Enviar el token en los encabezados de la solicitud
            }
        });
        console.log('Cliente actualizado con éxito');
        Swal.fire({
            icon: 'success',
            title: 'Cliente actualizado',
            text: 'El cliente ha sido actualizado exitosamente'
        });
        loadClientes(); // Recargar la lista de clientes después de actualizar
    } catch (error) {
        console.error('Error al actualizar el cliente:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Error al actualizar el cliente'
        });
    }
}

async function searchCliente() {
    const searchInput = document.getElementById('searchInput').value;
    try {
        const response = await axios.get(`/api/v1/clientes/search?query=${searchInput}`);
        const clientes = response.data;
        if (!Array.isArray(clientes)) {
            throw new Error('La respuesta no es un array');
        }
        const tableBody = document.getElementById('clientesTbBd');
        tableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

        clientes.forEach(cliente => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cliente.idcliente}</td>
                <td>${cliente.nombre}</td>
                <td>${cliente.apellido}</td>
                <td>${cliente.correo}</td>
                <td>${cliente.telefono}</td>
                <td>${cliente.pasaporte}</td>
                <td>${cliente.direccion}</td>
                
                <td>
                    <button class="btn btn-warning btn-sm" onclick="updateCliente('${cliente.idcliente}')">Actualizar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteCliente('${cliente.idcliente}')">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al buscar el cliente:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al buscar el cliente'
        });
    }
}

// Exponer las funciones globalmente para que puedan ser llamadas desde el HTML
window.deleteCliente = deleteCliente;
window.updateCliente = updateCliente;
window.loadClientes = loadClientes;
window.searchCliente = searchCliente;
});


