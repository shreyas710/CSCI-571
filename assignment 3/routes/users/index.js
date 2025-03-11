const express = require('express');
const { allUsers, registerUser, loginUser } = require('../../controllers/userController');
const { authMiddleware } = require('../../middlewares/authMiddleware');
const router = express.Router();

router.route('/').get(authMiddleware, allUsers);
router.post('/', registerUser);
router.post('/login', loginUser);

module.exports = router;