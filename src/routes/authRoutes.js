const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Define register and login endpoints
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
const authMiddleware = require("../middleware/authMiddleware");

// GET USER PROFILE
router.get("/me", authMiddleware, async (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
});
