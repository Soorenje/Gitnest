const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dir = "";
    if (file.fieldname === "avatar") {
      dir = "uploads/avatars/";
    } else if (file.fieldname === "cover") {
      dir = "uploads/courses/";
    }

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },

  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, uniqueName + fileExtension);
  },
});

const fileFilter = function (req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedMimeType = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];
  const allowedExtensions = [".jpeg", "jpg", ".png", ".webp"];
  if (
    allowedMimeType.includes(file.mimetype) ||
    allowedExtensions.includes(ext)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPG, PNG and WEBP files are supported.",
      ),
      false,
    );
  }
};

const imageUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

module.exports = imageUpload;
