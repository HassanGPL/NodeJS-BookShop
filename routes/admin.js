const path = require('path');
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const adminController = require('../controllers/admin');
const authMiddleware = require('../middlewares/auth');

router.get('/add-product', authMiddleware, adminController.getAddProduct);

router.post('/add-product',
    [
        body('title', 'Please Enter a Valid Title...').isString().isLength({ min: 3 }).trim(),
        body('imageUrl', 'Please Enter a Valid Image URL...').isURL().trim(),
        body('price', 'Please Enter a Valid Price...').isFloat().trim(),
        body('description', 'Please Enter a Valid Description...').isLength({ min: 5, max: 400 }).trim()
    ]
    , authMiddleware, adminController.postAddProduct);

router.get('/edit-product/:productID', authMiddleware, adminController.getEditProduct);

router.post('/edit-product', authMiddleware, [
    body('title', 'Please Enter a Valid Title...').isString().isLength({ min: 3 }).trim(),
    body('imageUrl', 'Please Enter a Valid Image URL...').isURL().trim(),
    body('price', 'Please Enter a Valid Price...').isFloat().trim(),
    body('description', 'Please Enter a Valid Description...').isLength({ min: 5, max: 400 }).trim()
]
    , adminController.postEditProduct);

router.post('/delete-product', authMiddleware, adminController.postDeleteProduct);

router.get('/products', authMiddleware, adminController.getAdminProducts);

module.exports = router;