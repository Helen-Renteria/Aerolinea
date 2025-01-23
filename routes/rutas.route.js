import { Router } from "express";
import { RutaController } from "../controllers/rutas.controller.js";
import { verifyAdmin, verifyToken } from "../middlewares/jwt.middlewares.js";

const router = Router();

// Ruta para registrar una nueva ruta
router.post('/register', RutaController.registerRuta);

// Ruta para mostrar todas las rutas
router.get('/list', RutaController.listRutas);

// Ruta para buscar una ruta por ID
router.get('/search', RutaController.searchRuta);

// Ruta para eliminar una ruta
router.delete('/:idruta', verifyToken, verifyAdmin, RutaController.deleteRuta);

// Ruta protegida para actualizar una ruta (PUT y PATCH)
router.put('/:idruta', verifyToken, verifyAdmin, RutaController.updateRuta);
router.patch('/:idruta', verifyToken, verifyAdmin, RutaController.updateRuta);

export default router;
