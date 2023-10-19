const express = require('express');
const authController = require('../controllers/auth');
const { check, body } = require('express-validator')

const router = express.Router();

router.get('/signup', authController.getSignup);
router.post('/signup',
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email...'),
        body('password', 'Please enter a password with only numbers and text and min length 8 characters')
            .isLength({ min: 8 })
            .isAlphanumeric(),
        body('confirmPassword')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords does not match!')
                }
                return true;
            })
    ]
    , authController.postSignup);


router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);




module.exports = router;