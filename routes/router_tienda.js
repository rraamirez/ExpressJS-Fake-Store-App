// ./routes/router_tienda.js
import express from "express";
import Productos from "../model/productos.js";
const router = express.Router();

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
    const usuario = req.session.usuario || null;
    const producto = await Productos.findById(id);
    res.render("producto", { producto, usuario });
  } catch (err) {
    res.status(500).send({ err });
  }
});

router.get("/producto/:id/editar", async (req, res) => {
  if (!req.session.usuario || !req.session.usuario.admin) {
    return res.status(403).send("No tienes permisos para editar productos!!");
  } else {
    try {
      const { id } = req.params;
      const producto = await Productos.findById(id);

      if (!producto) {
        return res.status(404).send("Producto no encontrado");
      }

      res.render("editar_producto", { producto });
    } catch (err) {
      if (err.name === "ValidationError") {
        res.status(400).send({ error: err.message });
      }
      res
        .status(500)
        .send({
          error: "Error al cargar el producto para editar",
          detalle: err,
        });
    }
  }
});

router.post("/producto/:id/editar", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price } = req.body;

    const producto = await Productos.findByIdAndUpdate(
      id,
      { title, price },
      { new: true, runValidators: true }
    );

    if (!producto) {
      return res.status(404).send("Producto no encontrado");
    }

    res.redirect("/producto/" + id);
  } catch (err) {
    res
      .status(500)
      .send({ error: "Error al actualizar el producto", detalle: err });
  }
});

router.get("/carrito", async (req, res) => {
  const productos = req.session.carrito || [];
  const total = productos.reduce((sum, product) => sum + product.price, 0);

  const prodCatsPromise = await Productos.find({});
  const categorias = [
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
    res.redirect("/carrito");
  } catch (err) {
    res.status(500).send({ err });
  }
});

//endpoint para traerme el carrito si lo necesitara (un json)
router.get("/api/carrito", (req, res) => {
  const productos = req.session.carrito || [];
  res.json(productos);
});

export default router;
