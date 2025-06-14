require("dotenv").config();
require("./config/db")();

const express = require("express");
const path = require("path");
const cors = require("cors");

const globalErrorHandler = require("./middlewares/globalErrorHandler");
const CustomError = require("./utils/CustomError");

const authRoutes = require("./routes/user.route");
const blogRoutes = require("./routes/blog.route");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const corsOptions = {
  // origin: "http://localhost:5173", // Change this to your frontend URL
  origin: "*", // Allow all origins
  credentials: true,
  methods: "GET, POST, PUT, DELETE, OPTIONS",
  allowedHeaders: "Content-Type, Authorization",
};

app.use(cors(corsOptions));

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.all("*wildcard", (req, res, next) => {
  const message =
    process.env.MODE === "development"
      ? `URL not found: ${req.originalUrl}`
      : "Something went wrong";
  next(new CustomError(message, 404));
});

// add routes here for global error handler
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
