const Blog = require("../models/blog.model");
const CustomError = require("../utils/CustomError");
const path = require("path");
const fs = require("fs");

exports.createBlog = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const file = req.file;
    const filename = file?.filename;

    await Blog.create({
      userId: req.user._id,
      title,
      description,
      image: filename,
    });

    return res.status(200).json({
      success: true,
      message: "Blog created sucessfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.fetchBlogs = async (req, res, next) => {
  try {
    const { page, limit } = req.query;

    const skip = (page - 1) * limit;
    const sort = {
      createdAt: -1,
    };

    // const filterData = {
    //   userId: req.user._id,
    // };

    const totalBlogs = await Blog.countDocuments();
    const blogs = await Blog.find()
      .select("_id title description image createdAt")
      .populate({
        path: "userId",
        select: "name _id",
      })
      .sort(sort)
      .skip(skip)
      .limit(limit);

    return res.status(201).json({
      success: true,
      message: "Blogs fetched sucessfully",
      data: {
        blogs,
        totalBlogs,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateBlog = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const { id } = req.params;

    const file = req.file;

    const existedBlog = await Blog.findById(id);

    if (!existedBlog) {
      next(new CustomError("Blog not found", 404));
    }

    if (file && existedBlog?.image) {
      const oldImagePath = path.join(
        __dirname,
        "..",
        "public",
        "uploads",
        existedBlog?.image
      );

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    existedBlog.title = title || existedBlog.title;
    existedBlog.description = description || existedBlog.description;

    if (req.file) {
      existedBlog.image = file?.filename;
    }

    await existedBlog.save();

    return res.status(200).json({
      success: true,
      message: "Blog updated sucessfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      next(new CustomError("Blog not found", 404));
    }

    const blogImage = path.join(
      __dirname,
      "..",
      "public",
      "uploads",
      blog?.image
    );

    if (fs.existsSync(blogImage)) {
      fs.unlinkSync(blogImage);
    }
    return res.status(200).json({
      success: true,
      message: "Blog deleted sucessfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.viewBlog = async (req, res, next) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id)
      .select("_id title description image createdAt comments")
      .populate({
        path: "userId", // blog's author
        select: "name _id",
      })
      .populate({
        path: "comments", // comment documents
        populate: {
          path: "userId", // commenter inside each comment
          select: "name _id",
        },
      });

    if (!blog) {
      return next(new CustomError("Blog not found", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Blog fetched successfully",
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};
