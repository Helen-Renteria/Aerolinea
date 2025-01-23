import { ReservaModel } from "../models/reservas.model.js";

// http://localhost:3000/api/v1/reservas/register
const registerReserva = async (req, res) => {
    try {
        const { idreserva, idcliente, idvuelo, fechareserva, clase, precio, estado } = req.body;

        if (!idreserva || !idcliente || !idvuelo || !fechareserva || !clase || !precio || !estado) {
            return res.status(400).json({
                ok: false,
                message: "Faltan campos!"
            });
        }

        const newReserva = await ReservaModel.createReserva({
            idreserva, idcliente, idvuelo, fechareserva, clase, precio, estado
        });

        return res.status(201).json({
            ok: true,
            message: 'Reserva creada correctamente',
            data: newReserva
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Error al crear la reserva!"
        });
    }
};

// http://localhost:3000/api/v1/reservas/list
const listReserva = async (req, res) => {
    try {
        const reservas = await ReservaModel.readReserva();
        res.json(reservas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las reservas' });
    }
};

const searchReserva = async (req, res) => {
    const { query } = req.query;
    try {
        const reservas = await ReservaModel.findByClienteId(query);
        return res.json(reservas);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error en el servidor'
        });
    }
};

// http://localhost:3000/api/v1/reservas/delete
const deleteReserva = async (req, res) => {
    const { idreserva } = req.params;
    const userRole = req.role;

    // Verificar si el rol del usuario es "superadmin" o "usu1"
    if (userRole !== 'superadmin' && userRole !== 'usu2') {
        return res.status(403).json({
            ok: false,
            message: 'No tienes permisos para eliminar reservas'
        });
    }

    try {
        const result = await ReservaModel.deleteReserva(idreserva);
        if (result.rowCount === 0) {
            return res.status(404).json({
                ok: false,
                message: 'Reserva no encontrada'
            });
        }
        return res.status(200).json({
            ok: true,
            message: 'Reserva eliminada correctamente'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error al eliminar la reserva'
        });
    }
};

const updateReserva = async (req, res) => {
    const { idreserva } = req.params;
    const updateFields = req.body;

    try {
        const updatedReserva = await ReservaModel.updateReserva(idreserva, updateFields);
        return res.status(200).json({
            ok: true,
            message: 'Reserva actualizada correctamente',
            data: updatedReserva
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: error.message
        });
    }
};

export const ReservaController = {
    registerReserva,
    listReserva,
    searchReserva,
    deleteReserva,
    updateReserva
};
