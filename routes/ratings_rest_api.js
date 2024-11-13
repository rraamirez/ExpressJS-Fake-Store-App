import express from "express";
import Productos from "../model/productos.js";
import { logger } from "../tienda.js";

const router = express.Router();

router.get("/api/ratings", async (req, res) => {
  try {
    logger.info("Fetching ratings");
    const productos = await Productos.find({});
    const ratings = productos.map((producto) => ({
      id: producto.id,
      title: producto.title,
      rating: producto.rating,
    }));
    res.json(ratings);
  } catch (err) {
    logger.error("Error fetching ratings", err);
    res.status(500).send({ err });
  }
});

router.get("/api/ratings/:id", async (req, res) => {
  const { id } = req.params;
  try {
    logger.info(`Fetching rating for product: ${id}`);
    const producto = await Productos.findById(id);
    if (producto) {
      res.json({
        id: producto.id,
        title: producto.title,
        rating: producto.rating,
      });
    } else {
      res.status(404).send("Product not found");
    }
    } catch (err) {
    logger.error("Error fetching rating", err);
    res.status(500).send({ err });
    }
});

router.put("/api/ratings/:id", async (req, res) => {
  const { id } = req.params;
  const { rating, count } = req.body;
  try {
    logger.info(`Updating rating for product: ${id}`);
    const producto = await Productos.findById(id);
    if (producto) {
      producto.rating = { rate: rating, count };
      await producto.save();
      res.json({
        id: producto.id,
        title: producto.title,
        rating: producto.rating,
      });
    } else {
      res.status(404).send("Product not found");
    }
  } catch (err) {
    logger.error("Error updating rating", err);
    res.status(500).send({ err });
  }
});

export default router;