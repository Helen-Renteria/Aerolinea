import { db } from '../database/conexion_db.js';

// Metodo Create
const createReserva = async ({ idreserva, idcliente, idvuelo, fechareserva, clase, precio, estado }) => {
    const query = {
        text: `
        INSERT INTO operaciones.reservas (idreserva, idcliente, idvuelo, fechareserva, clase, precio, estado)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
        `,
        values: [idreserva, idcliente, idvuelo, fechareserva, clase, precio, estado]
    };

    const { rows } = await db.query(query);
    return rows[0];
};

// Metodo Read
const readReserva = async () => {
    const query = {
        text: `
        SELECT * FROM operaciones.reservas`
    };

    const { rows } = await db.query(query);
    return rows;
};

// Metodo Update
const updateReserva = async (idreserva, updateFields) => {
    const setClause = Object.keys(updateFields).map((key, index) => `${key} = $${index + 2}`).join(', ');
    const values = [idreserva, ...Object.values(updateFields)];

    const updateQuery = {
        text: `
        UPDATE operaciones.reservas
        SET ${setClause}
        WHERE idreserva = $1
        RETURNING *
        `,
        values: values
    };

    try {
        const { rows } = await db.query(updateQuery);
        if (rows.length === 0) {
            throw new Error('Reserva no encontrada');
        }
        return rows[0];
    } catch (error) {
        console.error('Error al actualizar la reserva:', error);
        throw new Error('Error al intentar actualizar la reserva');
    }
};

// Buscar por ID
const findById_reserva = async (idreserva) => {
    const query = {
        text: `
        SELECT * FROM operaciones.reservas
        WHERE idreserva = $1
        `,
        values: [idreserva]
    };
    const { rows } = await db.query(query);
    return rows[0];
};

// Buscar por ID de cliente
const findByClienteId = async (idcliente) => {
    const query = {
        text: `
        SELECT * FROM operaciones.reservas
        WHERE idcliente = $1
        `,
        values: [idcliente]
    };
    const { rows } = await db.query(query);
    return rows;
};

// Metodo Delete
const deleteReserva = async (idreserva) => {
    const deleteQuery = {
        text: `
        DELETE FROM operaciones.reservas
        WHERE idreserva = $1
        `,
        values: [idreserva]
    };

    try {
        const result = await db.query(deleteQuery);
        if (result.rowCount === 0) {
            throw new Error('Reserva no encontrada');
        }
        return { success: true, message: 'Reserva eliminada' };
    } catch (error) {
        console.error('Error al eliminar la reserva:', error);
        throw new Error('Error al intentar eliminar la reserva');
    }
};

export const ReservaModel = {
    createReserva,
    readReserva,
    updateReserva,
    deleteReserva,
    findById_reserva,
    findByClienteId
};
