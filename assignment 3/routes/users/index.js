const express = require('express');
const { getUserProfile, registerUser, loginUser } = require('../../controllers/userController');
const { authMiddleware } = require('../../middlewares/authMiddleware');
const router = express.Router();

router.route('/').get(authMiddleware, getUserProfile);
router.post('/', registerUser);
router.post('/login', loginUser);

module.exports = router;