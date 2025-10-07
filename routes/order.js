const express = require('express')
const router = express.Router()
const orderController = require('../controllers/order')

router.get("/orders" , (req,res) => {
    orderController.getOrders(req,res)
})
router.post("/order", (req,res) => {
    orderController.placeOrder(req,res)
})

module.exports = router