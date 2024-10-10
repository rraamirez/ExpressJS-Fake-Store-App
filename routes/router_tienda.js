// ./routes/router_tienda.js
import express from "express";
import Productos from "../model/productos.js";
const router = express.Router();

//esto es basicamente el controller
      
router.get('/portada/:category', async (req, res) => {
  const { category } = req.params; // obtener la categoría del parámetro de la URL
  try {
    const productos = await Productos.find(category ? { category } : {}); // filtrar por categoría si existe
    console.log(productos);
    const categorias = [...new Set(productos.map(producto => producto.category))];
    res.render('portada.html', { productos, categorias });
  } catch (err) {
    res.status(500).send({ err });
  }
});

router.get('/base', async (req, res) => {
  try {
    const productos = await Productos.find({});
    const categorias = [...new Set(productos.map(producto => producto.category))];
    res.render('base.html', { productos, categorias });
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