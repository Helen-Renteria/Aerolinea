import { AvionModel } from "../models/aviones.model.js";

// http://localhost:3000/api/v1/aviones/register
const registerAvion = async (req, res) => {
    try {
        console.log(req.body);
        const { idavion, matricula, modelo, capacidad, aerolinea } = req.body;
        if (!idavion || !matricula || !modelo || !capacidad || !aerolinea) {
            return res.status(400).json({
                ok: false,
                message: "Faltan campos!"
            });
        }

        const avion = await AvionModel.findOneByMatricula(matricula);
        if (avion) {
            return res.status(409).json({
                ok: true,
                message: "El avión ya existe!"
            });
        }

        const newAvion = await AvionModel.createAvion({ idavion, matricula, modelo, capacidad, aerolinea });

        return res.status(201).json({
            ok: true,
            message: newAvion // avión creado
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Error al crear el avión!"
        });
    }
};

// http://localhost:3000/api/v1/aviones/list
const listAvion = async (req, res) => {
    try {
        const aviones = await AvionModel.readAvion();
        res.json(aviones);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los aviones' });
    }
};

const searchAvion = async (req, res) => {
    const { query } = req.query;
    try {
        const aviones = await AvionModel.findIdOrMatricula(query);
        return res.json(aviones);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error server'
        });
    }
};

// http://localhost:3000/api/v1/aviones/deleteAvion
const deleteAvion = async (req, res) => {
    const { idavion } = req.params;
    const userRole = req.role;

    // Verificar si el rol del usuario es "Superadmin" o "usu2"
    if (userRole !== 'superadmin' && userRole !== 'usu2') {
        return res.status(403).json({
            ok: false,
            message: 'No tienes permisos para eliminar aviones'
        });
    }
    try {
        const result = await AvionModel.deleteAvion(idavion);
        if (result.rowCount === 0) {
            return res.status(404).json({
                ok: false,
                message: 'Avión no encontrado'
            });
        }
        return res.status(200).json({
            ok: true,
            message: 'Avión eliminado correctamente'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error al eliminar el avión'
        });
    }
};

const updateAvion = async (req, res) => {
    const { idavion } = req.params;
    const updateFields = req.body;

    try {
        const updatedAvion = await AvionModel.updateAvion(idavion, updateFields);
        return res.status(200).json({
            ok: true,
            message: 'Avión actualizado correctamente',
            data: updatedAvion
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: error.message
        });
    }
};

export const AvionController = {
    registerAvion,
    listAvion,
    searchAvion,
    deleteAvion,
    updateAvion
};
