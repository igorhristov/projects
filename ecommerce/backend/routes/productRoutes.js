const express = require("express");
const router = express.Router();
const AsyncHandler = require("express-async-handler");
const Product = require("../models/productModel");

// GET /api/products
router.get(
  "/",
  AsyncHandler(async (req, res) => {
    const products = await Product.find({});

    res.json(products);
  })
);

// GET /api/products/:id
router.get(
  "/:id",
  AsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404)
      throw new Error('Product not found')
    }
  })
);

module.exports = router;