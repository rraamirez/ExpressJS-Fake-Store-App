import express from "express";
import nunjucks from "nunjucks";
import session from "express-session";      
import connectDB from "./model/db.js";

connectDB();

const app = express();

const IN = process.env.IN || 'development';

// Configuración de Nunjucks
nunjucks.configure('views', {         // directorio 'views' para las plantillas html
  autoescape: true,
  noCache: IN === 'development',       // true para desarrollo, sin cache
  watch: IN === 'development',         // reinicio con Ctrl-S
  express: app
});

app.set('view engine', 'html');

// Middleware para archivos estáticos y parseo de cuerpos
app.use(express.static('public'));     // directorio public para archivos
app.use(express.urlencoded({ extended: true }));  // Para poder leer req.body
app.use(session({
  secret: 'my-secret',      // cadena secreta para firmar la cookie de sesión
  resave: false,            // no guardar la sesión si no ha sido modificada
  saveUninitialized: false   // no crear sesión hasta que haya algo almacenado
}));

// Ruta de prueba para el servidor
app.get("/hola", (req, res) => {
  res.send('Hola desde el servidor de tienda!');
});

// Importar y usar las rutas
import TiendaRouter from "./routes/router_tienda.js";
app.use("/", TiendaRouter);

// Iniciar el servidor
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
