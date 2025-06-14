const express = require("express");
const upload = require("../config/multer");
const {
  createBlog,
  fetchBlogs,
  updateBlog,
  deleteBlog,
  viewBlog,
} = require("../controllers/blog.controller");
const { authToken } = require("../middlewares/authToken");

const router = express.Router();

router.post("/", authToken, upload.single("image"), createBlog);
router.get("/", fetchBlogs);
router.put("/:id", authToken, upload.single("image"), updateBlog);
router.delete("/:id", authToken, deleteBlog);
router.get("/:id", viewBlog);

// merge comment routes here
const commentRoutes = require("./comment.route");
router.use("/:blogId/comments", commentRoutes);

module.exports = router;
