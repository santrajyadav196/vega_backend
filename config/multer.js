const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../", "public", "uploads"));
  },
  filename: function (req, file, cb) {
    let fileName = `${new Date().getTime()}_${file.originalname}`;
    cb(null, fileName);
  },
});

module.exports = multer({ storage: storage });
