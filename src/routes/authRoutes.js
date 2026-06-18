const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const authMiddleware = require("../middleware/authMiddleware");

// Define register and login endpoints
router.post('/register', registerUser);
router.post('/login', loginUser);

// GET USER PROFILE (protected)
router.get('/me', authMiddleware, async (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
});

module.exports = router;
