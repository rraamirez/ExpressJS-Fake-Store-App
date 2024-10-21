// ./routes/router_tienda.js
import express from "express";
import Productos from "../model/productos.js";
const router = express.Router();

//this is just the controller (not rest)

router.get("/categorias/:categoria", async (req, res) => {
  const { categoria } = req.params;
  try {
    const productos = await Productos.find({ category: categoria });
    const categorias = [
      ...new Set((await Productos.find()).map((producto) => producto.category)),
    ];
    res.render("categoria", { categoria, productos, categorias });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching products");
  }
});

router.get("/", async (req, res) => {
  try {
    const productos = await Productos.find({});
    const categorias = [
      ...new Set(productos.map((producto) => producto.category)),
    ];
    res.render("portada", { categorias });
  } catch (err) {
    res.status(500).send({ err });
  }
});

//for searching products (recommended do with post instead of get and js?)
//deprecated, this one is done with get thanks to js help but will not be used
router.get("/productos", async (req, res) => {
  const searchTerm = req.query.search || "";
  try {
    const productos = await Productos.find({
      title: { $regex: searchTerm, $options: "i" },
    });
    const categorias = [
      ...new Set(productos.map((producto) => producto.category)),
    ];
    res.render("productos", { productos, categorias });
  } catch (err) {
    res.status(500).send({ err });
  }
});

router.post("/productos", async (req, res) => {
  const searchTerm = req.body.search || "";
  try {
    const productosPromise = Productos.find({
      title: { $regex: searchTerm, $options: "i" },
    });

    const prodCatsPromise = Productos.find({});

    const [productos, prodCats] = await Promise.all([
      productosPromise,
      prodCatsPromise,
    ]);
    const categorias = [
      ...new Set(prodCats.map((producto) => producto.category)),
    ];

    res.render("productos", { productos, categorias });
  } catch (err) {
    res.status(500).send({ err });
  }
});

router.get("/producto/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await Productos.findById(id);
    res.render("producto", { producto });
  } catch (err) {
    res.status(500).send({ err });
  }
});

router.get("/carrito", async (req, res) => {
  const productos = req.session.carrito || [];
  const total = productos.reduce((sum, product) => sum + product.price, 0);

  console.log("Cart content:", productos);
  console.log("Total:", total);

  const prodCatsPromise = await Productos.find({});
  const categorias = [ //ensoures no duplicates in categories and no categories lost
    ...new Set(prodCatsPromise.map((product) => product.category)),
  ];

  res.render("carrito", { productos, total, categorias });
});

router.post("/agregar-producto", async (req, res) => {
  const idProducto = req.body.id;
  try {
    const producto = await Productos.findById(idProducto);
    if (!req.session.carrito) {
      req.session.carrito = [];
    }
    req.session.carrito.push(producto);
    console.log("Carrito al agregar: ", req.session.carrito);
    res.redirect("/carrito");
  } catch (err) {
    res.status(500).send({ err });
  }
});

//this is for knowing the carrito length and if it is empty or not
router.get('/api/carrito', (req, res) => {
  const productos = req.session.carrito || [];
  res.json(productos);
});


export default router;
