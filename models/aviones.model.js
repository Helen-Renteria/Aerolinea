import { db } from '../database/conexion_db.js';

// Método Create
const createAvion = async ({ idavion, matricula, modelo, capacidad, aerolinea }) => {
    const query = {
        text: `
        INSERT INTO operaciones.aviones (idavion, matricula, modelo, capacidad, aerolinea)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        `,
        values: [idavion, matricula, modelo, capacidad, aerolinea]
    };

    const { rows } = await db.query(query);
    return rows[0];
};

// Método Read
const readAvion = async () => {
    const result = {
        text: `
        SELECT * FROM operaciones.aviones`
    };
    const { rows } = await db.query(result);
    return rows;
};

// Método Update
const updateAvion = async (idavion, updateFields) => {
    const setClause = Object.keys(updateFields)
        .map((key, index) => `${key} = $${index + 2}`)
        .join(', ');
    const values = [idavion, ...Object.values(updateFields)];

    const updateQuery = {
        text: `
        UPDATE operaciones.aviones
        SET ${setClause}
        WHERE idavion = $1
        RETURNING *
        `,
        values: values
    };

    try {
        const { rows } = await db.query(updateQuery);
        if (rows.length === 0) {
            throw new Error('Avión no encontrado');
        }
        return rows[0];
    } catch (error) {
        console.error('Error al actualizar el avión:', error);
        throw new Error('Error al intentar actualizar el avión');
    }
};

// Buscar por matrícula
const findOneByMatricula = async (matricula) => {
    const query = {
        text: `
        SELECT * FROM operaciones.aviones 
        WHERE matricula = $1
        `,
        values: [matricula]
    };
    const { rows } = await db.query(query);
    return rows[0];
};

// Buscar por ID
const findByIdAvion = async (idavion) => {
    const query = {
        text: `
        SELECT * FROM operaciones.aviones
        WHERE idavion = $1
        `,
        values: [idavion]
    };
    const { rows } = await db.query(query);
    return rows[0];
};

// Buscar por ID o matrícula
const findIdOrMatricula = async (query) => {
    let queryText;
    let values;

    // Si el query es un número (idavion)
    if (!isNaN(query)) {
        queryText = `
        SELECT * FROM operaciones.aviones
        WHERE idavion = $1`;
        values = [query];
    }
    // Si el query es una matrícula (cadena de texto)
    else {
        queryText = `
        SELECT * FROM operaciones.aviones
        WHERE matricula = $1`;
        values = [query];
    }
    const { rows } = await db.query({
        text: queryText,
        values: values
    });
    return rows;
};

// Método Delete
const deleteAvion = async (idavion) => {
    const deleteQuery = {
        text: `
        DELETE FROM operaciones.aviones
        WHERE idavion = $1
        `,
        values: [idavion]
    };
    try {
        const result = await db.query(deleteQuery);
        if (result.rowCount === 0) {
            throw new Error('Avión no encontrado');
        }
        // Si la eliminación fue exitosa, podemos devolver un mensaje o un valor
        return { success: true, message: 'Avión eliminado' };
    } catch (error) {
        // Manejo de errores en caso de fallos en la consulta
        console.error('Error al eliminar el avión:', error);
        throw new Error('Error al intentar eliminar el avión');
    }
};

export const AvionModel = {
    createAvion,
    readAvion,
    updateAvion,
    deleteAvion,
    findOneByMatricula,
    findByIdAvion,
    findIdOrMatricula
};
