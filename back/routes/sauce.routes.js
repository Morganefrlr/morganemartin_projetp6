const router = require('express').Router();
const sauceController = require('../controllers/sauce.controller.js');
const auth = require('../middleware/auth.middleware.js');
const multer = require('../middleware/multer.middleware.js');



router.post('/',auth,multer, sauceController.createSauce);
router.get('/:id',auth, sauceController.sauceInfo);
router.get('/',auth, sauceController.readSauce);
router.put('/:id',auth,multer, sauceController.updateSauce);
router.post('/:id/like',auth, sauceController.likeSauce);
router.delete('/:id',auth,multer, sauceController.deleteSauce);







module.exports = router;