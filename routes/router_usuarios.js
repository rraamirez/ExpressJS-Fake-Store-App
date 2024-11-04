import express from "express";
import jwt from "jsonwebtoken"; 
import Usuarios from "../model/usuarios.js"; 
const router = express.Router();

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const usuario = await verificarUsuario(username, password);

  if (usuario) {
    req.session.usuario = usuario;

    // con el campo admin ya puedo saber si es admin en cualquier parte de la aplicación
    const token = jwt.sign(
      { usuario: usuario.username, admin: usuario.admin }, 
      process.env.SECRET_KEY
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.IN === 'production' 
    }).redirect("/");
  } else {
    res.redirect("/login?error=1"); 
  }
});

async function verificarUsuario(username, password) {
  console.log("verificarUsuario", username, password);
  const usuario = await Usuarios.findOne({ username: username, password: password });
  return usuario ? { username: usuario.username, admin: usuario.admin } : null; 
}

router.get("/logout", (req, res) => {
  req.session.destroy(); //asi libramos todo
  res.clearCookie("access_token"); 
  res.redirect("/");
});

export default router;
