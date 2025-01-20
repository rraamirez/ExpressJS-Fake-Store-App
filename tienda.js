import express from "express";
import nunjucks from "nunjucks";
import session from "express-session";      
import cookieParser from "cookie-parser"; // Importar cookie-parser
import connectDB from "./model/db.js";
import jwt from "jsonwebtoken";
import winston from "winston";


connectDB();

const app = express();

const IN = process.env.IN || 'development';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});
export { logger };



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

// Middleware para cookies
app.use(cookieParser()); // Usar cookie-parser

app.use(session({
  secret: 'my-secret',      // cadena secreta para firmar la cookie de sesión
  resave: true,            // no guardar la sesión si no ha sido modificada
  saveUninitialized: true   // no crear sesión hasta que haya algo almacenado
}));

// Middleware para exponer la sesión a todas las plantillas
app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario || null;
  next();
});

// Middleware de autenticación
const autenticacion = (req, res, next) => {
  const token = req.cookies.access_token;
  if (token) {
    try {
      const data = jwt.verify(token, process.env.SECRET_KEY);
      req.username = data.usuario;  // username en el request
    } catch (error) {
      console.error("Token inválido", error);
      // Opcional: manejar el error de token inválido
    }
  }
  next();
};
app.use(autenticacion); // Usar el middleware de autenticación

app.use(express.json()); // Para poder leer req.body en formato JSON

// Ruta de prueba para el servidor
app.get("/hola", (req, res) => {
  res.send('Hola desde el servidor de tienda!');
});

// Importar y usar las rutas
import TiendaRouter from "./routes/router_tienda.js";
app.use("/", TiendaRouter);

import UsuariosRouter from "./routes/router_usuarios.js";
app.use("/", UsuariosRouter);

import RatingsRestApi from "./routes/ratings_rest_api.js";
app.use("/", RatingsRestApi);

// Iniciar el servidor
const PORT = process.env.PORT || 8000;
app.listen(PORT, '0.0.0.0', () => { //with this route we can access from any device in the same network
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
