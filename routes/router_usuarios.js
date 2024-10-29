// ./routes/router_tienda.js
import express from "express";
import Productos from "../model/productos.js";
import jwt from "jsonwebtoken"; // Asegúrate de importar jwt
const router = express.Router();

// Para mostrar formulario de login
router.get("/login", (req, res) => {
  res.render("login");
});

// Para recoger datos del formulario de login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const usuario = await verificarUsuario(username, password);

  if (usuario) {
    req.session.usuario = usuario; 

    // Generar el token JWT
    const token = jwt.sign({ usuario: usuario.username }, process.env.SECRET_KEY);

    // Establecer la cookie con el token
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.IN === 'production' // Asegúrate de que 'IN' esté bien configurado
    });

    const productos = await Productos.find({});
    const categorias = [
      ...new Set(productos.map((producto) => producto.category)),
    ];
    return res.render("portada", { usuario, productos, categorias });
  } else {
    return res.redirect("/login");
  }
});

// Función ficticia para verificar usuario
async function verificarUsuario(username, password) {
  return true; // Implementa la lógica de autenticación real aquí
}

router.get("/logout", (req, res) => {
  req.session.usuario = null;
  res.clearCookie("access_token"); // Asegúrate de limpiar la cookie al cerrar sesión
  res.redirect("/login"); // Redirige a la página de login
});

export default router;
