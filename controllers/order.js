const Product = require("../models/product");
const Order = require("../models/order");
const OrderItem = require("../models/order-item");

class orderController {
  async placeOrder(req, res) {
    const cart = await req.user.getCart();
    const cartProducts = await cart.getProducts();

    console.log(cartProducts)

    if (cartProducts.length === 0) {
      res.status(400).json({ message: "Cart is empty" });
    }

  
     const order = await req.user.createOrder();
    

    await order.addProducts(cartProducts, {
      through: OrderItem,
      fields: cartProducts.map((product) => ({
        quantity: product.cartItem.quantity,
        price: product.price,
        productId: product.id,
      })),
    });

    await cart.removeProducts(cartProducts);
    res.status(201).json({
      message: "Order made",
      orderId: order.id,
    });
  }

  async getOrders(req, res) {
    const orders = await req.user.getOrders({
      include: [
        {
          model: Product,
          attributes: ["id", "title"],
          through: { attributes: ["quantity", "price"] }, 
        },
      ],
      order: [["createdAt", "DESC"]], 
    });

    res.status(200).json({
      message: "Orders are here",
      orders: orders,
    });
  }
}

module.exports = new orderController();
