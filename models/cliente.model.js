import {db} from '../database/conexion_db.js';
//Metodo Create
const createCliente = async ({idcliente, nombre, apellido, correo, telefono, pasaporte, direccion}) => {
    const query = {
        text: `
        INSERT INTO operaciones.clientes (idcliente, nombre, apellido, correo, telefono, pasaporte, direccion)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
        `,
        values: [idcliente, nombre, apellido, correo, telefono, pasaporte, direccion]
    }

    const { rows } = await db.query(query);
    return rows[0];
}

//Metodo Read
const readCliente = async () => {
    const result = {
        text: `
        SELECT * FROM operaciones.clientes`
    }
    const { rows } = await db.query(result);
    return rows
}

const updateCliente = async (idcliente, updateFields) => {
    const setClause = Object.keys(updateFields).map((key, index) => `${key} = $${index + 2}`).join(', ');
    const values = [idcliente, ...Object.values(updateFields)];

    const updateQuery = {
        text: `
        UPDATE operaciones.clientes
        SET ${setClause}
        WHERE idcliente = $1
        RETURNING *
        `,
        values: values
    };

    try {
        const { rows } = await db.query(updateQuery);
        if (rows.length === 0) {
            throw new Error('Cliente no encontrado');
        }
        return rows[0];
    } catch (error) {
        console.error('Error al actualizar el cliente:', error);
        throw new Error('Error al intentar actualizar el cliente');
    }
};

//Buscar o validar por email
const findOneByEmail = async (correo) => {
    const query = {
        text: `
        SELECT * FROM operaciones.clientes 
        WHERE correo = $1
        `,
        values: [correo]//faltaba
    }
    const {rows} = await db.query(query, [correo]);
    return rows[0];
}
//Buscar por ID
const findById_cliente = async (idcliente) => {
    const query = {
        text: `
        SELECT * FROM operaciones.clientes
        WHERE idcliente = $1
        `,
        values: [idcliente]
    }
    const { rows } = await db.query(query)
    return rows[0]
}
//Buscar por ID o email
const findIdOrEmail = async (query) => {
    let queryText;
    let values;

    // Si el query es un número (idcliente)
    if (!isNaN(query)) {
        queryText = `
        SELECT * FROM operaciones.clientes 
        WHERE idcliente = $1`;
        values = [query];
    }
    // Si el query es un email (cadena de texto)
    else {
        queryText = `
        SELECT * FROM operaciones.clientes 
        WHERE correo = $1`;
        values = [query];
    }
    const { rows } = await db.query({
        text: queryText,
        values: values
    });
    return rows;
}

//Metodo Delete
const deleteCliente = async (idcliente) => {
    const deleteQuery = {
        text: `
        DELETE FROM operaciones.clientes
        WHERE idcliente = $1
        `,
        values: [idcliente]
    }
    try {
        const result = await db.query(deleteQuery);
        if (result.rowCount === 0) {
            throw new Error('Cliente no encontrado');
    }
     // Si la eliminación fue exitosa, podemos devolver un mensaje o un valor
        return { success: true, message: 'Cliente eliminado' };

    }catch (error) {
        // Manejo de errores en caso de fallos en la consulta
        console.error('Error al eliminar el cliente:', error);
        throw new Error('Error al intentar eliminar el cliente');
        
    }
}


export const ClientModel = {
    createCliente,
    readCliente,
    updateCliente,
    deleteCliente,
    findOneByEmail,
    findById_cliente,
    findIdOrEmail
}