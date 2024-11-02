import express from "express";
import jwt from "jsonwebtoken"; 
import Usuarios from "../model/usuarios.js"; // Asegúrate de importar el modelo correctamente
const router = express.Router();

router.get("/login", (req, res) => {
  res.render("login");
});

// Asegúrate de que esta función sea asíncrona
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Aquí llamamos a la función de verificación
  const usuario = await verificarUsuario(username, password); // Esto es válido ya que estamos en una función async

  if (usuario) {
    req.session.usuario = usuario; 

    const token = jwt.sign({ usuario: usuario.username }, process.env.SECRET_KEY);

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.IN === 'production' 
    }).redirect("/");
  } else {
    res.redirect("/login?error=1"); 
  }
});

// La función verificarUsuario debería seguir siendo asíncrona
async function verificarUsuario(username, password) {
  console.log("verificarUsuario", username, password);
  const usuario = await Usuarios.findOne({ username: username, password: password });
  return usuario ? { username: usuario.username } : null; 
}

router.get("/logout", (req, res) => {
  req.session.destroy(); // Saca todas las sesiones
  res.clearCookie("access_token"); 
  res.redirect("/");
});

export default router;
