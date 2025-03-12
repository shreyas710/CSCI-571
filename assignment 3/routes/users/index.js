const express = require('express');
const { getUserProfile, registerUser, loginUser, deleteUser } = require('../../controllers/userController');
const { authMiddleware } = require('../../middlewares/authMiddleware');
const router = express.Router();

router.route('/').get(authMiddleware, getUserProfile);
router.route('/').delete(authMiddleware, deleteUser);
router.post('/', registerUser);
router.post('/login', loginUser);

module.exports = router;