import { MongoClient } from 'mongodb';
import fetch from 'node-fetch';  // Importar fetch para Node.js
import dotenv from 'dotenv';     // Cargar variables del archivo .env

dotenv.config(); // Cargar variables de entorno del archivo .env

console.log('🏁 seed.js ----------------->');

// del archivo .env
const USER_DB = process.env.USER_DB;
const PASS = process.env.PASS;

const url = `mongodb://${USER_DB}:${PASS}@localhost:27017`;
const client = new MongoClient(url);

// Nombre de la base de datos
const dbName = 'myProject';

// Función asíncrona para insertar datos en una colección
async function Inserta_datos_en_colección(colección, apiUrl) {
  try {
    await client.connect();  // Conectarse a MongoDB
    const db = client.db(dbName);  // Seleccionar la base de datos

    // Obtener datos de la API
    const datos = await fetch(apiUrl).then((res) => res.json());

    // Insertar datos en la colección
    const resultado = await db.collection(colección).insertMany(datos);

    return `${resultado.insertedCount} datos traídos e insertados en ${colección}`;
  } catch (err) {
    console.error(`Error en fetch o inserción para ${colección}:`, err);
    throw err;
  } finally {
    await client.close();  // Cerrar la conexión a MongoDB
  }
}

// Inserción consecutiva de productos y usuarios
Inserta_datos_en_colección('productos', 'https://fakestoreapi.com/products')
  .then((r) => console.log(`Todo bien: ${r}`)) // OK
  .then(() => Inserta_datos_en_colección('usuarios', 'https://fakestoreapi.com/users'))
  .then((r) => console.log(`Todo bien: ${r}`)) // OK
  .catch((err) => console.error('Algo mal: ', err)); // Manejo de errores

console.log('Lo primero que pasa');
