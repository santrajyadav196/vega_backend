const express = require("express");

const { addComment } = require("../controllers/comment.controller");
const { authToken } = require("../middlewares/authToken");

const router = express.Router({ mergeParams: true });

router.post("/", authToken, addComment);

module.exports = router;
