const path = require('path');
const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');
const authMiddleware = require('../middlewares/auth');

router.get('/add-product', authMiddleware, adminController.getAddProduct);

router.post('/add-product', authMiddleware, adminController.postAddProduct);

router.get('/edit-product/:productID', authMiddleware, adminController.getEditProduct);

router.post('/edit-product', authMiddleware, adminController.postEditProduct);

router.post('/delete-product', authMiddleware, adminController.postDeleteProduct);

router.get('/products', authMiddleware, adminController.getAdminProducts);

module.exports = router;