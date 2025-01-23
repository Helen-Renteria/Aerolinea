import { RutaModel } from "../models/rutas.model.js";

// http://localhost:3000/api/v1/rutas/register
const registerRuta = async (req, res) => {
    try {
        console.log(req.body);
        const { idruta, origen, destino, distancia } = req.body;
        
        if (!idruta || !origen || !destino || !distancia) {
            return res.status(400).json({
                ok: false,
                message: "Faltan campos!"
            });
        }

        const ruta = await RutaModel.findByIdRuta(idruta);
        if (ruta) {
            return res.status(409).json({
                ok: true,
                message: "La ruta ya existe!"
            });
        }

        const newRuta = await RutaModel.createRuta({ idruta, origen, destino, distancia });

        return res.status(201).json({
            ok: true,
            message: 'Ruta creada exitosamente',
            data: newRuta
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Error al crear la ruta!"
        });
    }
};

// http://localhost:3000/api/v1/rutas/list
const listRutas = async (req, res) => {
    try {
        const rutas = await RutaModel.readRutas();
        res.json(rutas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las rutas' });
    }
};

// http://localhost:3000/api/v1/rutas/search
const searchRuta = async (req, res) => {
    const { query } = req.query;
    try {
        const rutas = await RutaModel.findByIdRuta(query);
        return res.json(rutas);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error al buscar la ruta'
        });
    }
};

// http://localhost:3000/api/v1/rutas/deleteRuta
const deleteRuta = async (req, res) => {
    const { idruta } = req.params;

    try {
        const result = await RutaModel.deleteRuta(idruta);
        if (result.rowCount === 0) {
            return res.status(404).json({
                ok: false,
                message: 'Ruta no encontrada'
            });
        }
        return res.status(200).json({
            ok: true,
            message: 'Ruta eliminada correctamente'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error al eliminar la ruta'
        });
    }
};

// http://localhost:3000/api/v1/rutas/updateRuta
const updateRuta = async (req, res) => {
    const { idruta } = req.params;
    const updateFields = req.body;

    try {
        const updatedRuta = await RutaModel.updateRuta(idruta, updateFields);
        return res.status(200).json({
            ok: true,
            message: 'Ruta actualizada correctamente',
            data: updatedRuta
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: error.message
        });
    }
};

export const RutaController = {
    registerRuta,
    listRutas,
    searchRuta,
    deleteRuta,
    updateRuta
};
