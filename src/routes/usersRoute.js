const express = require('express');
const router = express.Router();

const {registerUser, loginUser} = require("../controllers/usersController");
const {validateUser} = require("../middlewares/validationMiddleware");

router.post("/register", [validateUser], registerUser);
router.post("/login", loginUser);

module.exports = router;