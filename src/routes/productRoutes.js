const express = require('express')
const router = express.Router()
const { getProducts, createProduct } = require('../controllers/productController')
const { verifyToken, isAdmin } = require('../middleware/authMiddleware')

router.get('/', getProducts)
router.post('/', verifyToken, isAdmin, createProduct)

module.exports = router
