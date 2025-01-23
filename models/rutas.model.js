import { db } from '../database/conexion_db.js';

// Metodo Create
const createRuta = async ({ idruta, origen, destino, distancia }) => {
    const query = {
        text: `
        INSERT INTO ubicaciones.rutas (idruta, origen, destino, distancia)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        values: [idruta, origen, destino, distancia]
    };

    const { rows } = await db.query(query);
    return rows[0];
};

// Metodo Read
const readRutas = async () => {
    const query = {
        text: `
        SELECT * FROM ubicaciones.rutas`
    };

    const { rows } = await db.query(query);
    return rows;
};

// Metodo Update
const updateRuta = async (idruta, updateFields) => {
    const setClause = Object.keys(updateFields)
        .map((key, index) => `${key} = $${index + 2}`)
        .join(', ');

    const values = [idruta, ...Object.values(updateFields)];

    const updateQuery = {
        text: `
        UPDATE ubicaciones.rutas
        SET ${setClause}
        WHERE idruta = $1
        RETURNING *
        `,
        values: values
    };

    try {
        const { rows } = await db.query(updateQuery);
        if (rows.length === 0) {
            throw new Error('Ruta no encontrada');
        }
        return rows[0];
    } catch (error) {
        console.error('Error al actualizar la ruta:', error);
        throw new Error('Error al intentar actualizar la ruta');
    }
};

// Buscar por ID
const findByIdRuta = async (idruta) => {
    const query = {
        text: `
        SELECT * FROM ubicaciones.rutas
        WHERE idruta = $1
        `,
        values: [idruta]
    };

    const { rows } = await db.query(query);
    return rows[0];
};

// Metodo Delete
const deleteRuta = async (idruta) => {
    const deleteQuery = {
        text: `
        DELETE FROM ubicaciones.rutas
        WHERE idruta = $1
        `,
        values: [idruta]
    };

    try {
        const result = await db.query(deleteQuery);
        if (result.rowCount === 0) {
            throw new Error('Ruta no encontrada');
        }
        return { success: true, message: 'Ruta eliminada' };
    } catch (error) {
        console.error('Error al eliminar la ruta:', error);
        throw new Error('Error al intentar eliminar la ruta');
    }
};

export const RutaModel = {
    createRuta,
    readRutas,
    updateRuta,
    deleteRuta,
    findByIdRuta
};
