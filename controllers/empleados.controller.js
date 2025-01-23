import { EmpleadoModel }  from "../models/empleados.model.js"

// http://localhost:3000/api/v1/empleados/register
const registerEmpleado = async (req, res) => {
    try {
        console.log(req.body);
        const { idempleado, nombre, apellido, cargo, idvuelo, telefono } = req.body;
        if (!idempleado || !nombre || !apellido || !cargo || !idvuelo || !telefono) {
            return res.status(400).json({
                ok: false,
                message: "Faltan campos!"
            });
        }
        const empleadoExistente = await EmpleadoModel.findIdOrTelefono(telefono);
        if (empleadoExistente.length > 0) {
            return res.status(409).json({
                ok: true,
                message: "El empleado ya existe!"
            });
        }

        const newEmpleado = await EmpleadoModel.createEmpleado({ idempleado, nombre, apellido, cargo, idvuelo, telefono });

        return res.status(201).json({
            ok: true,
            message: newEmpleado
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Error al crear el empleado!"
        });
    }
};

// http://localhost:3000/api/v1/empleados/list
const listEmpleado = async (req, res) => {
    try {
        const empleados = await EmpleadoModel.readEmpleado();
        res.json(empleados);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los empleados' });
    }
};

// http://localhost:3000/api/v1/empleados/search
const searchEmpleado = async (req, res) => {
    const { query } = req.query;
    try {
        const empleados = await EmpleadoModel.findIdOrTelefono(query);
        return res.json(empleados);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error del servidor'
        })
    }
}

// http://localhost:3000/api/v1/empleados/delete
const deleteEmpleado = async (req, res) => {
    const { idempleado } = req.params;
    const userRole = req.role;

    // Verificar si el rol del usuario es "superadmin" o "usu1"
    if (userRole !== 'superadmin' && userRole !== 'usu2') {
        return res.status(403).json({
            ok: false,
            message: 'No tienes permisos para eliminar empleados'
        });
    }
    try {
        const result = await EmpleadoModel.deleteEmpleado(idempleado);
        if (result.rowCount === 0) {
            return res.status(404).json({
                ok: false,
                message: 'Empleado no encontrado'
            });
        }
        return res.status(200).json({
            ok: true,
            message: 'Empleado eliminado correctamente'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error al eliminar el empleado'
        });
    }
};

// http://localhost:3000/api/v1/empleados/update
const updateEmpleado = async (req, res) => {
    const { idempleado } = req.params;
    const updateFields = req.body;

    try {
        const updatedEmpleado = await EmpleadoModel.updateEmpleado(idempleado, updateFields);
        return res.status(200).json({
            ok: true,
            message: 'Empleado actualizado correctamente',
            data: updatedEmpleado
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: error.message
        });
    }
};

export const EmpleadoController = {
    registerEmpleado,
    listEmpleado,
    searchEmpleado,
    deleteEmpleado,
    updateEmpleado
};
