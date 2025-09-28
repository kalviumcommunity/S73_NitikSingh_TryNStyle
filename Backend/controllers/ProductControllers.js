const Product = require("../models/Product")

exports.CreateProduct = async(req, res) => {
    try {
        const {name, price, stock, images} = req.body;
        if(!name || !price || !stock || !images) {
            return res.status(400).json({message: "All fields are required"});
        }

        const newProduct = new Product({name, price, stock, images})
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    }
    catch(err){
        return res.status(500).json({message: "server error", err})
    }
}

exports.GetProducts = async(req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    }
    catch(err){
        return res.status(500).json({message: "server error", err})
    }
}

exports.GetProductById = async(req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);
    } catch (err) {
        return res.status(500).json({ message: "server error", err });
    }
}