import express from "express";
import jwt from "jsonwebtoken"; 
import Usuarios from "../model/usuarios.js"; 
const router = express.Router();

router.get("/login", (req, res) => {
  const error = req.query.error === '401'; // asi puedo si mi post devuelve error=401 puedo llevarlo a la vista
  res.render("login", { error });
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
    res.redirect("/login?error=401"); 
  }
});

async function verificarUsuario(username, password) {
  const usuario = await Usuarios.findOne({ username: username, password: password });
  if (usuario) {
    return { username: usuario.username, admin: usuario.admin };
  } else {
    return null; 
  }
}


router.get("/logout", (req, res) => {
  req.session.destroy(); //asi me borro todo lo que haya en las sesiones
  res.clearCookie("access_token"); 
  res.redirect("/");
});

export default router;
