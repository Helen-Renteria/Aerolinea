import { db } from '../database/conexion_db.js';

// Método Create
const createEmpleado = async ({idempleado, nombre, apellido, cargo, idvuelo, telefono}) => {
    const query = {
        text: `
        INSERT INTO operaciones.empleados (idempleado, nombre, apellido, cargo, idvuelo, telefono)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
        `,
        values: [idempleado, nombre, apellido, cargo, idvuelo, telefono]
    }

    const { rows } = await db.query(query);
    return rows[0];
}

// Método Read
const readEmpleado = async () => {
    const result = {
        text: `
        SELECT * FROM operaciones.empleados`
    }
    const { rows } = await db.query(result);
    return rows
}

// Método Update
const updateEmpleado = async (idempleado, updateFields) => {
    const setClause = Object.keys(updateFields).map((key, index) => `${key} = $${index + 2}`).join(', ');
    const values = [idempleado, ...Object.values(updateFields)];

    const updateQuery = {
        text: `
        UPDATE operaciones.empleados
        SET ${setClause}
        WHERE idempleado = $1
        RETURNING *
        `,
        values: values
    };

    try {
        const { rows } = await db.query(updateQuery);
        if (rows.length === 0) {
            throw new Error('Empleado no encontrado');
        }
        return rows[0];
    } catch (error) {
        console.error('Error al actualizar el empleado:', error);
        throw new Error('Error al intentar actualizar el empleado');
    }
};

// Buscar por ID
const findById_empleado = async (idempleado) => {
    const query = {
        text: `
        SELECT * FROM operaciones.empleados
        WHERE idempleado = $1
        `,
        values: [idempleado]
    };
    const { rows } = await db.query(query, [idempleado]);
    return rows[0];
}

// Buscar por ID o teléfono
const findIdOrTelefono = async (query) => {
    let queryText;
    let values;

    // Si el query es un número (idempleado)
    if (!isNaN(query)) {
        queryText = `
        SELECT * FROM operaciones.empleados 
        WHERE idempleado = $1`;
        values = [query];
    }
    // Si el query es un teléfono (cadena de texto)
    else {
        queryText = `
        SELECT * FROM operaciones.empleados 
        WHERE telefono = $1`;
        values = [query];
    }

    const { rows } = await db.query({
        text: queryText,
        values: values
    });
    return rows;
};

// Método Delete
const deleteEmpleado = async (idempleado) => {
    const deleteQuery = {
        text: `
        DELETE FROM operaciones.empleados
        WHERE idempleado = $1
        `,
        values: [idempleado]
    }

    try {
        const result = await db.query(deleteQuery);
        if (result.rowCount === 0) {
            throw new Error('Empleado no encontrado');
        }
        return { success: true, message: 'Empleado eliminado' };
    } catch (error) {
        console.error('Error al eliminar el empleado:', error);
        throw new Error('Error al intentar eliminar el empleado');
    }
};

export const EmpleadoModel = {
    createEmpleado,
    readEmpleado,
    updateEmpleado,
    deleteEmpleado,
    findById_empleado,
    findIdOrTelefono
};
