import { Router } from "express";
import { AvionController } from "../controllers/aviones.controller.js";
import { verifyAdmin, verifyToken } from "../middlewares/jwt.middlewares.js";

const router = Router();

// Ruta para registrar un avión
router.post('/register', AvionController.registerAvion);

// Ruta para mostrar los aviones
router.get('/list', AvionController.listAvion);

// Ruta para buscar aviones
router.get('/search', AvionController.searchAvion);

// Ruta para eliminar un avión
router.delete('/:idavion', verifyToken, verifyAdmin, AvionController.deleteAvion);

// Ruta protegida para actualizar un avión (PUT y PATCH)
router.put('/:idavion', verifyToken, verifyAdmin, AvionController.updateAvion);
router.patch('/:idavion', verifyToken, verifyAdmin, AvionController.updateAvion);

export default router;
