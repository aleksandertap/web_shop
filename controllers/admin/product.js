const Product = require("../../models/product");

class adminController {
  async addProduct(req, res) {
    const product = await Product.create({
      title: req.body.title,
      price: req.body.price,
      imageUrl: req.body.imageUrl,
      description: req.body.description,
      userId: req.user.id
    });
    res.status(201).json({
      message: "Product added",
      productId: product.id,
    });
  }

  async getAllProducts(req, res) {
    const products = await Product.findAll();
    res.status(201).json({
      products: products,
    });
  }

  async getProductById(req, res) {
    const product = await Product.findByPk(req.params.id);
    res.status(200).json({
      product: product,
    });
  }

  async editProduct(req, res) {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    if (req.body.title !== undefined) {
      product.title = req.body.title;
    }
    if (req.body.price !== undefined) {
      product.price = req.body.price;
    }
    if (req.body.imageUrl !== undefined) {
      product.imageUrl = req.body.imageUrl;
    }
    if (req.body.description !== undefined) {
      product.description = req.body.description;
    }
    await product.save();
    res.status(200).json({
      message: "Product updated",
      product: product,
    });
  }

  async deleteProduct(req,res){
      const product = await Product.findByPk(req.params.id)
      if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
      await product.destroy()
      res.status(200).json({
        message: `Product ${product.id} deleted`
      })
    }
}

module.exports = new adminController();
