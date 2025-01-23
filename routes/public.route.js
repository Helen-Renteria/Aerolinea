import { Router } from "express";
import path from "path";
import { fileURLToPath } from 'url';

const router = Router();


const __filename = fileURLToPath(import.meta.url);//añadido
const __dirname = path.dirname(__filename);//añadido

//ruta login
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

//ruta home
router.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

//ruta cliente
router.get('/clientes', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/clientes.html'));
});

//ruta empleados
router.get('/empleados', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/empleados.html'));
});

//ruta aviones
router.get('/Aviones', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/aviones.html'));
});

//ruta reservas
router.get('/Reservas', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/reservas.html'));
});

//ruta vuelos
router.get('/Vuelos', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/vuelos.html'));
});

//ruta aeropuertos
router.get('/Aeropuertos', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/aeropuertos.html'));
});

//ruta rutas
router.get('/Rutas', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/rutas.html'));
});




export default router;