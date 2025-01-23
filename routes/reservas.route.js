import { Router } from "express";
import { ReservaController } from "../controllers/reservas.controller.js";
import { verifyAdmin, verifyToken } from "../middlewares/jwt.middlewares.js";

const router = Router();

// Ruta para registrar una reserva
router.post('/register', ReservaController.registerReserva);

// Ruta para mostrar las reservas
router.get('/list', ReservaController.listReserva);

// Ruta para buscar las reservas
router.get('/search', ReservaController.searchReserva);

// Ruta para eliminar una reserva
router.delete('/:idreserva', verifyToken, verifyAdmin, ReservaController.deleteReserva);

// Ruta protegida para actualizar una reserva (PUT y PATCH)
router.put('/:idreserva', verifyToken, verifyAdmin, ReservaController.updateReserva);
router.patch('/:idreserva', verifyToken, verifyAdmin, ReservaController.updateReserva);

export default router;
