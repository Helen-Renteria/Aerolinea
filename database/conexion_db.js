import 'dotenv/config';
import pg from 'pg'; // Importar pg de postgres

const { Pool } = pg; // Destructuring del pool

const connectionString = process.env.DATABASE_URL; // Obtener la conexión a la base de datos

// Instancia nueva de Pool
export const db = new Pool({
    allowExitOnIdle: true,// se deja en true para que el pool se cierre cuando no se esté utilizando
    connectionString, // Conexión a la base de datos
/*     ssl: {
        rejectUnauthorized: false
      } */
});

//Probar conexion
try {
    await db.query('SELECT NOW()'); // Realizar una consulta, un await para esperar a que se ejecute 
    console.log("Conexión Exitosa!!");
} catch (error) {
    console.log(error);
}

//Como probar la conexión
//node database/conexion_db.js