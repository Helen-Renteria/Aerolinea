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


export default router;