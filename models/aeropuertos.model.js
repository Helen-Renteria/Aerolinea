import { db } from '../database/conexion_db.js';

// Metodo Create
const createAeropuerto = async ({ idaeropuerto, nombre, ciudad, pais, codigoiata }) => {
    const query = {
        text: `
        INSERT INTO ubicaciones.aeropuertos (idaeropuerto, nombre, ciudad, pais, codigoiata)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        `,
        values: [idaeropuerto, nombre, ciudad, pais, codigoiata]
    }

    const { rows } = await db.query(query);
    return rows[0];
}

// Metodo Read
const readAeropuertos = async () => {
    const result = {
        text: `
        SELECT * FROM ubicaciones.aeropuertos`
    }
    const { rows } = await db.query(result);
    return rows;
}

const updateAeropuerto = async (idaeropuerto, updateFields) => {
    const setClause = Object.keys(updateFields).map((key, index) => `${key} = $${index + 2}`).join(', ');
    const values = [idaeropuerto, ...Object.values(updateFields)];

    const updateQuery = {
        text: `
        UPDATE ubicaciones.aeropuertos
        SET ${setClause}
        WHERE idaeropuerto = $1
        RETURNING *
        `,
        values: values
    };

    try {
        const { rows } = await db.query(updateQuery);
        if (rows.length === 0) {
            throw new Error('Aeropuerto no encontrado');
        }
        return rows[0];
    } catch (error) {
        console.error('Error al actualizar el aeropuerto:', error);
        throw new Error('Error al intentar actualizar el aeropuerto');
    }
};

// Buscar por ID
const findByIdAeropuerto = async (idaeropuerto) => {
    const query = {
        text: `
        SELECT * FROM ubicaciones.aeropuertos
        WHERE idaeropuerto = $1
        `,
        values: [idaeropuerto]
    }
    const { rows } = await db.query(query);
    return rows[0];
}

// Metodo Delete
const deleteAeropuerto = async (idaeropuerto) => {
    const deleteQuery = {
        text: `
        DELETE FROM ubicaciones.aeropuertos
        WHERE idaeropuerto = $1
        `,
        values: [idaeropuerto]
    }
    try {
        const result = await db.query(deleteQuery);
        if (result.rowCount === 0) {
            throw new Error('Aeropuerto no encontrado');
        }
        return { success: true, message: 'Aeropuerto eliminado' };
    } catch (error) {
        console.error('Error al eliminar el aeropuerto:', error);
        throw new Error('Error al intentar eliminar el aeropuerto');
    }
}

export const AeropuertoModel = {
    createAeropuerto,
    readAeropuertos,
    updateAeropuerto,
    deleteAeropuerto,
    findByIdAeropuerto
}
