const express = require("express")
const router = express.Router()
const ProductControllers = require("../controllers/ProductControllers")

router.post("/create-products", ProductControllers.CreateProduct)
router.get("/get-products", ProductControllers.GetProducts)
router.get("/:id", ProductControllers.GetProductById)

module.exports = router

