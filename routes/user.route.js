const express = require("express");
const { signupUser, loginUser } = require("../controllers/user.controller");
const upload = require("../config/multer");

const router = express.Router();

router.post("/signup", upload.single("profile"), signupUser);
router.post("/login", loginUser);

module.exports = router;
