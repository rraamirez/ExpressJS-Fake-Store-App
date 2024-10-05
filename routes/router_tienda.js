// ./routes/router_tienda.js
import express from "express";
import Productos from "../model/productos.js";
const router = express.Router();

//esto es basicamente el controller
      
router.get('/portada', async (req, res) => {
  try {
    const productos = await Productos.find({});
    const categorias = [...new Set(productos.map(producto => producto.category))];
    res.render('portada.html', { productos, categorias });
  } catch (err) {
    res.status(500).send({ err });
  }
});

router.get('/api/productos', async (req, res) => {
  try {
      const productos = await Productos.find({});
      res.json(productos);
  } catch (err) {
      res.status(500).send({ err });
  }
});

export default router