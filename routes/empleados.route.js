import { Router } from "express";
import { EmpleadoController } from "../controllers/empleados.controller.js";
import { verifyAdmin, verifyToken } from "../middlewares/jwt.middlewares.js";

const router = Router();

// Ruta para registrar un empleado
router.post('/register', EmpleadoController.registerEmpleado);

// Ruta para mostrar todos los empleados
router.get('/list', EmpleadoController.listEmpleado);

// Ruta para buscar un empleado
router.get('/search', EmpleadoController.searchEmpleado);

// Ruta para eliminar un empleado
router.delete('/:idempleado', verifyToken, verifyAdmin, EmpleadoController.deleteEmpleado);

// Ruta para actualizar un empleado (PUT y PATCH)
router.put('/:idempleado', verifyToken, verifyAdmin, EmpleadoController.updateEmpleado);
router.patch('/:idempleado', verifyToken, verifyAdmin, EmpleadoController.updateEmpleado);

export default router;
