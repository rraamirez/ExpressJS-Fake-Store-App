// ./routes/router_tienda.js
import express from "express";
import Productos from "../model/productos.js";
const router = express.Router();

//esto es basicamente el controller
      
router.get('/categorias/:categoria', async (req, res) => {
  const { categoria } = req.params; 
  try {
    const productos = await Productos.find({ category: categoria });
    const categorias = [...new Set((await Productos.find()).map(producto => producto.category))];
    res.render('categoria', { categoria, productos, categorias });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener productos');
  }
});

router.get('/', async (req, res) => {
  try {
    const productos = await Productos.find({});
    const categorias = [...new Set(productos.map(producto => producto.category))];
    res.render('portada', { categorias });
  } catch (err) {
    res.status(500).send({ err });
  }
});

router.get('/productos', async (req, res) => {
  const searchTerm = req.query.search || ''; 
  try {
    const productos = await Productos.find({
      title: { $regex: searchTerm, $options: 'i' } 
    });
    const categorias = [...new Set(productos.map(producto => producto.category))];
    res.render('productos', { productos, categorias });
  } catch (err) {
    res.status(500).send({ err });
  }
});

router.get('/carrito', async (req, res) => {
  res.render('carrito');
});





export default router