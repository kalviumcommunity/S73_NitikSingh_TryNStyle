const express = require("express")
const router = express.Router()
const ProductCrontroller = require("../controllers/ProductControllers")

router.post("/create-products", ProductCrontroller.CreateProduct)
router.get("/get-products", ProductCrontroller.GetProducts)

module.exports  = router

