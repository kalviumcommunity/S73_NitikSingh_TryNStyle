const Product  = require("../models/Product")
exports.CreateProduct = async(req, res) => {
    try {
       const {name, price, stock, images} = req.body;
    //    if(!name) {
    //     return res.status(400).json({message: "Name is required"})
    //    }
    //    else if(!price){
    //     return res.status(400).json({messsage: "Price is required"})
    //    }
    //    else {
    //     return res.status(400).json({message: "Stock is required"})
    //    }
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