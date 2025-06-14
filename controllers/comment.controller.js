const Comment = require("../models/comment.model");
const Blog = require("../models/blog.model");
const CustomError = require("../utils/CustomError");

exports.addComment = async (req, res, next) => {
  try {
    const { blogId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return next(new CustomError("Blog not found", 404));
    }

    const comment = await Comment.create({
      blogId,
      userId,
      content,
    });

    blog.comments.push(comment._id);
    await blog.save();

    return res.status(200).json({
      success: true,
      message: "Comment created sucessfully",
    });
  } catch (error) {
    next(error);
  }
};
