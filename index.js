/**
 * Configuracion del servidor
 */
import 'dotenv/config'; // Importa la configuración de entorno 
import express from 'express'; // Importar el modulo express
import clienteRouter from './routes/cliente.route.js';
import publicRouter from './routes/public.route.js';
import usersRouter from './routes/users.route.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);//añadido
const __dirname = path.dirname(__filename);//añadido

const app = express(); // Crear una instancia de express


// Redirigir la ruta raíz a la página de login
app.get('/', (req, res) => {
    res.redirect('/login');
});

//Middleware de aplicación app.use()
app.use(express.json());//parsear el body de la petición a json
app.use(express.urlencoded({ extended: true}));//formdata para tramites con formularios
// Configurar el encabezado Content-Type para UTF-8

//app.use(express.static('public'));


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', publicRouter);//
app.use('/api/v1/clientes', clienteRouter);//vista cliente
app.use('/api/v1/users', usersRouter);//vista Usuario



//RUTAS 
const PORT = process.env.PORT || 3000; // Para usar procces.env se importa el dotenv/config

//Levantar el servidor 
app.listen(PORT, () => { console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`)});