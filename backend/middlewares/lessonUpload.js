const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dir = "uploads/lessons/";
    if (file.mimetype.startsWith("video/")) {
      dir += "videos/";
    } else{
      dir += "files/";
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
  const allowedMimeTypes = [
    "application/pdf",
    "application/zip",
    "application/x-zip-compressed",
    "application/x-rar-compressed",
  ];
  
  if (
    file.mimetype.startsWith("video/") ||
    allowedMimeTypes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file format. Only videos, PDFs, and compressed files (ZIP/RAR) are allowed."
      ),
      false
    );
  }
};

const lessonUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024,
  },
});

module.exports = lessonUpload;
