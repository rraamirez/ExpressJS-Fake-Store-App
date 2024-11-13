import express from "express";
import jwt from "jsonwebtoken"; 
import Usuarios from "../model/usuarios.js"; 
import { logger } from "../tienda.js";

const router = express.Router();

router.get("/login", (req, res) => {
  logger.info("Route '/login' was visited"); 
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  logger.info(`Login attempt for user: ${username}`); 

  const usuario = await verifyUser(username, password);

  if (usuario) {
    req.session.usuario = usuario;
    const token = jwt.sign(
      { usuario: usuario.username, admin: usuario.admin }, 
      process.env.SECRET_KEY
    );

    logger.info(`User ${username} authenticated successfully`); 
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' 
    }).redirect("/");
  } else {
    logger.warn(`Failed login attempt for user: ${username}`); 
    res.redirect("/login?error=1");
  }
});

async function verifyUser(username, password) {
  logger.info(`Verifying user: ${username}`); 
  const usuario = await Usuarios.findOne({ username: username, password: password });
  return usuario ? { username: usuario.username, admin: usuario.admin } : null; 
}

router.get("/logout", (req, res) => {
  logger.info("User logged out"); 
  req.session.destroy();
  res.clearCookie("access_token");
  res.redirect("/");
});

export default router;
