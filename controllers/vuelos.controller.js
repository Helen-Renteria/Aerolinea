import { VueloModel } from "../models/vuelos.model.js";

// http://localhost:3000/api/v1/vuelos/register
const registerVuelo = async (req, res) => {
    try {
        console.log(req.body);
        const { idvuelo, numerovuelo, idavion, origen, destino, fechasalida, fechallegada, estado } = req.body;
        if (!idvuelo || !numerovuelo || !idavion || !origen || !destino || !fechasalida || !fechallegada || !estado) {
            return res.status(400).json({ ok: false, message: "Faltan campos!" });
        }

        const vuelo = await VueloModel.findByNumeroVuelo(numerovuelo);
        if (vuelo) {
            return res.status(409).json({ ok: true, message: "El vuelo ya existe!" });
        }

        const newVuelo = await VueloModel.createVuelo({ idvuelo, numerovuelo, idavion, origen, destino, fechasalida, fechallegada, estado });

        return res.status(201).json({
            ok: true,
            message: newVuelo
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Error al crear el vuelo!"
        });
    }
};

// http://localhost:3000/api/v1/vuelos/list
const listVuelos = async (req, res) => {
    try {
        const vuelos = await VueloModel.readVuelos();
        res.json(vuelos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los vuelos' });
    }
};

const searchVuelo = async (req, res) => {
    const { query } = req.query;
    try {
        const vuelos = await VueloModel.findByIdVuelo(query) || await VueloModel.findByNumeroVuelo(query);
        return res.json(vuelos);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error server'
        });
    }
};

// http://localhost:3000/api/v1/vuelos/delete
const deleteVuelo = async (req, res) => {
    const { idvuelo } = req.params;
    const userRole = req.role;

    // Verificar si el rol del usuario es "superadmin" o "usu1"
    if (userRole !== 'superadmin' && userRole !== 'usu2') {
        return res.status(403).json({
            ok: false,
            message: 'No tienes permisos para eliminar vuelos'
        });
    }
    try {
        const result = await VueloModel.deleteVuelo(idvuelo);
        if (result.rowCount === 0) {
            return res.status(404).json({
                ok: false,
                message: 'Vuelo no encontrado'
            });
        }
        return res.status(200).json({
            ok: true,
            message: 'Vuelo eliminado correctamente'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error al eliminar el vuelo'
        });
    }
};

const updateVuelo = async (req, res) => {
    const { idvuelo } = req.params;
    const updateFields = req.body;

    try {
        const updatedVuelo = await VueloModel.updateVuelo(idvuelo, updateFields);
        return res.status(200).json({
            ok: true,
            message: 'Vuelo actualizado correctamente',
            data: updatedVuelo
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: error.message
        });
    }
};

export const VueloController = {
    registerVuelo,
    listVuelos,
    searchVuelo,
    deleteVuelo,
    updateVuelo
};
