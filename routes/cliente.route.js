import { Router } from "express";
import { ClientController } from "../controllers/cliente.controller.js";
import { verifyAdmin, verifyToken } from "../middlewares/jwt.middlewares.js";

const router = Router();

// Ruta para registrar un cliente
router.post('/register', ClientController.registerCliente);

// Ruta para mostrar los clientes
router.get('/list', ClientController.listCliente);

// Ruta para buscar los clientes
router.get('/search', ClientController.searchCliente);

// Ruta para eliminar un cliente
router.delete('/:idcliente', verifyToken, verifyAdmin, ClientController.deleteCliente);

// Ruta protegida para actualizar un cliente (PUT y PATCH)
router.put('/:idcliente', verifyToken, verifyAdmin, ClientController.updateClient);
router.patch('/:idcliente', verifyToken, verifyAdmin, ClientController.updateClient);

export default router;