import { Router } from "express";
import { VueloController } from "../controllers/vuelos.controller.js";
import { verifyAdmin, verifyToken } from "../middlewares/jwt.middlewares.js";

const router = Router();

// Ruta para registrar un vuelo
router.post('/register', VueloController.registerVuelo);

// Ruta para mostrar los vuelos
router.get('/list', VueloController.listVuelos);

// Ruta para buscar vuelos
router.get('/search', VueloController.searchVuelo);

// Ruta para eliminar un vuelo
router.delete('/:idvuelo', verifyToken, verifyAdmin, VueloController.deleteVuelo);

// Ruta protegida para actualizar un vuelo (PUT y PATCH)
router.put('/:idvuelo', verifyToken, verifyAdmin, VueloController.updateVuelo);
router.patch('/:idvuelo', verifyToken, verifyAdmin, VueloController.updateVuelo);

export default router;