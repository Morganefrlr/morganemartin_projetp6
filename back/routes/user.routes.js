const router = require('express').Router();
const userController = require('../controllers/user.controller.js');


router.post('/signup', userController.signUp);
router.post('/login', userController.logIn);


module.exports = router;