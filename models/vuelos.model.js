import { db } from '../database/conexion_db.js';

// Método Create
const createVuelo = async ({ idvuelo, numerovuelo, idavion, origen, destino, fechasalida, fechallegada, estado }) => {
    const query = {
        text: `
        INSERT INTO operaciones.vuelos (idvuelo, numerovuelo, idavion, origen, destino, fechasalida, fechallegada, estado)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
        `,
        values: [idvuelo, numerovuelo, idavion, origen, destino, fechasalida, fechallegada, estado]
    };

    const { rows } = await db.query(query);
    return rows[0];
};

// Método Read
const readVuelos = async () => {
    const result = {
        text: `SELECT * FROM operaciones.vuelos`
    };
    const { rows } = await db.query(result);
    return rows;
};

// Método Update
const updateVuelo = async (idvuelo, updateFields) => {
    const setClause = Object.keys(updateFields).map((key, index) => `${key} = $${index + 2}`).join(', ');
    const values = [idvuelo, ...Object.values(updateFields)];

    const updateQuery = {
        text: `
        UPDATE operaciones.vuelos
        SET ${setClause}
        WHERE idvuelo = $1
        RETURNING *
        `,
        values: values
    };

    try {
        const { rows } = await db.query(updateQuery);
        if (rows.length === 0) {
            throw new Error('Vuelo no encontrado');
        }
        return rows[0];
    } catch (error) {
        console.error('Error al actualizar el vuelo:', error);
        throw new Error('Error al intentar actualizar el vuelo');
    }
};

// Método Buscar por ID
const findByIdVuelo = async (idvuelo) => {
    const query = {
        text: `
        SELECT * FROM operaciones.vuelos
        WHERE idvuelo = $1
        `,
        values: [idvuelo]
    };
    const { rows } = await db.query(query);
    return rows[0];
};

// Método Buscar por número de vuelo
const findByNumeroVuelo = async (numerovuelo) => {
    const query = {
        text: `
        SELECT * FROM operaciones.vuelos
        WHERE numerovuelo = $1
        `,
        values: [numerovuelo]
    };
    const { rows } = await db.query(query);
    return rows[0];
};

// Método Delete
const deleteVuelo = async (idvuelo) => {
    const deleteQuery = {
        text: `
        DELETE FROM operaciones.vuelos
        WHERE idvuelo = $1
        `,
        values: [idvuelo]
    };
    try {
        const result = await db.query(deleteQuery);
        if (result.rowCount === 0) {
            throw new Error('Vuelo no encontrado');
        }
        return { success: true, message: 'Vuelo eliminado' };
    } catch (error) {
        console.error('Error al eliminar el vuelo:', error);
        throw new Error('Error al intentar eliminar el vuelo');
    }
};

export const VueloModel = {
    createVuelo,
    readVuelos,
    updateVuelo,
    deleteVuelo,
    findByIdVuelo,
    findByNumeroVuelo
};
