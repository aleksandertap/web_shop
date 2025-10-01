const Product = require("../models/product");
const Cart = require("../models/cart");
const CartItem = require("../models/cart-item");

class shopController {
  async getAllProducts(req, res) {
    const products = await Product.findAll();
    res.status(201).json({
      products: products,
    });
  }

  async getCart(req, res) {
    const userCart = await req.user.getCart();
    console.log(userCart);
    const cartProducts = await userCart.getProducts();
    res.status(201).json({
      products: cartProducts,
    });
  }

  async addToCart(req, res) {
    const prodId = req.params.id;
    try {
      const product = await Product.findByPk(prodId);
      if (!product) {
        return res.status(404).json({ message: "Product not found." });
      }
      const cart = await req.user.getCart();
      const cartItems = await cart.getProducts({ where: { id: prodId } });
      let newQuantity = 1;

      if (cartItems.length > 0) {
        const existingCartItem = cartItems[0].cartItem;
        newQuantity = existingCartItem.quantity + 1;
      }

      await cart.addProduct(product, {
        through: { quantity: newQuantity },
      });

      res.status(200).json({ message: "Product added to cart successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to add product to cart." });
    }
  }

  async removeFromCart(req, res) {
    const prodId = req.params.id;

    try {
      const product = await Product.findByPk(prodId);
      if (!product) {
        return res.status(404).json({ message: "Product not found." });
      }

      const cart = await req.user.getCart();
      const cartItems = await cart.getProducts({ where: { id: prodId } });

      if (cartItems.length === 0) {
        return res.status(404).json({ message: "Product not found in cart." });
      }

      const existingCartItem = cartItems[0].cartItem;
      const currentQuantity = existingCartItem.quantity;

      if (currentQuantity > 1) {

        const newQuantity = currentQuantity - 1;
        await cart.addProduct(product, {
          through: { quantity: newQuantity },
        });

        res.status(200).json({
          message: `Product quantity decremented to ${newQuantity}.`,
        });
      } else {
        await cart.removeProduct(product);

        res.status(200).json({
          message: "Product fully removed from cart.",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to remove product from cart." });
    }
  }
}

module.exports = new shopController();
