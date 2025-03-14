const express = require('express');
const { getUserProfile, registerUser, loginUser, deleteUser, addFavorite, removeFavorite } = require('../../controllers/userController');
const { authMiddleware } = require('../../middlewares/authMiddleware');
const router = express.Router();

router.route('/').get(authMiddleware, getUserProfile);
router.route('/').delete(authMiddleware, deleteUser);
router.post('/', registerUser);
router.post('/login', loginUser);
router.route('/favorites').post(authMiddleware, addFavorite);
router.route('/favorites').delete(authMiddleware, removeFavorite);

module.exports = router;