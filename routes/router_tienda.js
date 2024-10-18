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

//for searching products (recommended do with post instead of get and js?)
//deprecated
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

router.post('/productos', async (req, res) => {
  const searchTerm = req.body.search || ''; 
  try {
    const productosPromise = Productos.find({
      title: { $regex: searchTerm, $options: 'i' }
    });
    
    const prodCatsPromise = Productos.find({});

    const [productos, prodCats] = await Promise.all([productosPromise, prodCatsPromise]);
    const categorias = [...new Set(prodCats.map(producto => producto.category))];

    res.render('productos', { productos, categorias });
  } catch (err) {
    res.status(500).send({ err });
  }
});



router.get('/producto/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await Productos.findById(id);
    res.render('producto', { producto });
  } catch (err) {
    res.status(500).send({ err });
  }
});

router.get('/carrito', async (req, res) => {
  const productos = req.session.carrito || [];
  const total = productos.reduce((sum, product) => sum + product.price, 0);
  const numProducts = productos.length;

  console.log("Contenido del carrito:", productos);
  console.log("Total del carrito:", total);


  const prodCatsPromise = await Productos.find({});
  const categorias = [...new Set(prodCatsPromise.map(product => product.category))];

  res.render('carrito', { productos, total, categorias });
});


router.post('/agregar-producto', async (req, res) => { 
  const idProducto = req.body.id;
  try{
    const producto = await Productos.findById(idProducto);
    if(!req.session.carrito){
      req.session.carrito = [];
    }
    req.session.carrito.push(producto);
    console.log("Carrito al agregar: ",req.session.carrito);
    console.log("ID de sesión (POST):", req.sessionID);
    res.redirect('/carrito'); 

  }catch(err){
    res.status(500).send({ err });
  }
});

router.get('/api/carrito', (req, res) => {
  const productos = req.session.carrito || [];
  res.json({ numProds: productos.length });
});




export default router