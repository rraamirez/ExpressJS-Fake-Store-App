import express from "express";
import Productos from "../model/productos.js";
import { logger } from "../tienda.js";

const router = express.Router();

router.get("/categorias/:categoria", async (req, res) => {
  const { categoria } = req.params;
  try {
    logger.info(`Fetching products for category: ${categoria}`);
    const productos = await Productos.find({ category: categoria });
    const categorias = [
      ...new Set((await Productos.find()).map((producto) => producto.category)),
    ];
    res.render("categoria", { categoria, productos, categorias });
  } catch (error) {
    logger.error("Error fetching products by category", error);
    res.status(500).send("Error fetching products");
  }
});

router.get("/", async (req, res) => {
  try {
    logger.info("Fetching products for homepage");
    const productos = await Productos.find({});
    const categorias = [
      ...new Set(productos.map((producto) => producto.category)),
    ];
    res.render("portada", { categorias });
  } catch (err) {
    logger.error("Error loading homepage", err);
    res.status(500).send({ err });
  }
});

router.get("/productos", async (req, res) => {
  const searchTerm = req.query.search || "";
  try {
    logger.info(`Searching products with term: ${searchTerm}`);
    const productos = await Productos.find({
      title: { $regex: searchTerm, $options: "i" },
    });
    const categorias = [
      ...new Set(productos.map((producto) => producto.category)),
    ];
    res.render("productos", { productos, categorias });
  } catch (err) {
    logger.error("Error fetching products", err);
    res.status(500).send({ err });
  }
});

router.post("/productos", async (req, res) => {
  const searchTerm = req.body.search || "";
  try {
    logger.info(`Searching products with term (POST): ${searchTerm}`);
    const productosPromise = await Productos.find({
      title: { $regex: searchTerm, $options: "i" },
    });
    const prodCatsPromise = await Productos.find({});
    const [productos, prodCats] = await Promise.all([
      productosPromise,
      prodCatsPromise,
    ]);
    const categorias = [
      ...new Set(prodCats.map((producto) => producto.category)),
    ];
    res.render("productos", { productos, categorias });
  } catch (err) {
    logger.error("Error in product search (POST)", err);
    res.status(500).send({ err });
  }
});

router.get("/producto/:id", async (req, res) => {
  const { id } = req.params;
  try {
    logger.info(`Fetching product with ID: ${id}`);
    const usuario = req.session.usuario || null;
    const producto = await Productos.findById(id);
    res.render("producto", { producto, usuario });
  } catch (err) {
    logger.error("Error fetching product by ID", err);
    res.status(500).send({ err });
  }
});

router.get("/producto/:id/editar", async (req, res) => {
  if (!req.session.usuario || !req.session.usuario.admin) {
    logger.warn("Unauthorized access attempt to edit product");
    return res.status(403).send("You do not have permission to edit products!");
  }
  try {
    const { id } = req.params;
    logger.info(`Fetching product with ID: ${id} for editing`);
    const producto = await Productos.findById(id);
    if (!producto) {
      return res.status(404).send("Product not found");
    }
    res.render("editar_producto", { producto });
  } catch (err) {
    logger.error("Error fetching product for editing", err);
    res.status(500).send({
      error: "Error loading product for editing",
      details: err,
    });
  }
});

router.post("/producto/:id/editar", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price } = req.body;
    logger.info(`Updating product with ID: ${id}`);
    const producto = await Productos.findByIdAndUpdate(
      id,
      { title, price },
      { new: true, runValidators: true }
    );
    if (!producto) {
      return res.status(404).send("Product not found");
    }
    res.redirect("/producto/" + id);
  } catch (err) {
    logger.error("Error updating product", err);
    res.status(500).send({
      error: "Error updating product",
      details: err,
    });
  }
});

router.get("/carrito", async (req, res) => {
  const productos = req.session.carrito || [];
  const total = productos.reduce((sum, product) => sum + product.price, 0);
  logger.info("Fetching shopping cart");
  const prodCatsPromise = await Productos.find({});
  const categorias = [
    ...new Set(prodCatsPromise.map((product) => product.category)),
  ];
  res.render("carrito", { productos, total, categorias });
});

router.post("/agregar-producto", async (req, res) => {
  const idProducto = req.body.id;
  try {
    logger.info(`Adding product with ID: ${idProducto} to cart`);
    const producto = await Productos.findById(idProducto);
    if (!req.session.carrito) {
      req.session.carrito = [];
    }
    req.session.carrito.push(producto);
    res.redirect("/carrito");
  } catch (err) {
    logger.error("Error adding product to cart", err);
    res.status(500).send({ err });
  }
});

router.get("/api/carrito", (req, res) => {
  logger.info("Fetching shopping cart data (JSON)");
  const productos = req.session.carrito || [];
  res.json(productos);
});

export default router;
