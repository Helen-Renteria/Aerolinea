import { Router } from "express";
import { AeropuertoController } from "../controllers/aeropuertos.controller.js";
import { verifyAdmin, verifyToken } from "../middlewares/jwt.middlewares.js";

const router = Router();

// Ruta para registrar un aeropuerto
router.post('/register', AeropuertoController.registerAeropuerto);

// Ruta para mostrar los aeropuertos
router.get('/list', AeropuertoController.listAeropuertos);

// Ruta para buscar aeropuertos
router.get('/search', AeropuertoController.searchAeropuerto);

// Ruta para eliminar un aeropuerto
router.delete('/:idaeropuerto', verifyToken, verifyAdmin, AeropuertoController.deleteAeropuerto);

// Ruta protegida para actualizar un aeropuerto (PUT y PATCH)
router.put('/:idaeropuerto', verifyToken, verifyAdmin, AeropuertoController.updateAeropuerto);
router.patch('/:idaeropuerto', verifyToken, verifyAdmin, AeropuertoController.updateAeropuerto);

export default router;
