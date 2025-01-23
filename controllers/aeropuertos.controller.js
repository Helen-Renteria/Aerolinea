import { AeropuertoModel } from "../models/aeropuertos.model.js";

// http://localhost:3000/api/v1/aeropuertos/register
const registerAeropuerto = async (req, res) => {
    try {
        console.log(req.body); // Para verificar los datos que llegan
        const { idaeropuerto, nombre, ciudad, pais, codigoiata } = req.body;

        if (!idaeropuerto || !nombre || !ciudad || !pais || !codigoiata) {
            return res.status(400).json({ ok: false, message: "Faltan campos!" });
        }

        const aeropuerto = await AeropuertoModel.findByIdAeropuerto(idaeropuerto);
        if (aeropuerto) {
            return res.status(409).json({ ok: true, message: "El aeropuerto ya existe!" });
        }

        // Crear nuevo aeropuerto
        const newAeropuerto = await AeropuertoModel.createAeropuerto({ idaeropuerto, nombre, ciudad, pais, codigoiata });

        return res.status(201).json({
            ok: true,
            message: newAeropuerto // Cambiar mensaje por aeropuerto creado
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Error al crear el aeropuerto!"
        });
    }
}

// http://localhost:3000/api/v1/aeropuertos/list
const listAeropuertos = async (req, res) => {
    try {
        const aeropuertos = await AeropuertoModel.readAeropuertos();
        res.json(aeropuertos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los aeropuertos' });
    }
};

// Buscar aeropuerto por ID o nombre
const searchAeropuerto = async (req, res) => {
    const { query } = req.query;
    try {
        const aeropuertos = await AeropuertoModel.findByIdAeropuerto(query);
        return res.json(aeropuertos);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error server'
        });
    }
}

// http://localhost:3000/api/v1/aeropuertos/deleteAeropuerto
const deleteAeropuerto = async (req, res) => {
    const { idaeropuerto } = req.params;
    const userRole = req.role;

    // Verificar si el rol del usuario es "superadmin" o "usu1"
    if (userRole !== 'superadmin' && userRole !== 'usu2') {
        return res.status(403).json({
            ok: false,
            message: 'No tienes permisos para eliminar el aeropuerto'
        });
    }

    try {
        const result = await AeropuertoModel.deleteAeropuerto(idaeropuerto);
        if (result.rowCount === 0) {
            return res.status(404).json({
                ok: false,
                message: 'Aeropuerto no encontrado'
            });
        }
        return res.status(200).json({
            ok: true,
            message: 'Aeropuerto eliminado correctamente'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error al eliminar el aeropuerto'
        });
    }
}

// Actualizar aeropuerto
const updateAeropuerto = async (req, res) => {
    const { idaeropuerto } = req.params;
    const updateFields = req.body;

    try {
        const updatedAeropuerto = await AeropuertoModel.updateAeropuerto(idaeropuerto, updateFields);
        return res.status(200).json({
            ok: true,
            message: 'Aeropuerto actualizado correctamente',
            data: updatedAeropuerto
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: error.message
        });
    }
};

export const AeropuertoController = {
    registerAeropuerto,
    listAeropuertos,
    searchAeropuerto,
    deleteAeropuerto,
    updateAeropuerto
}
