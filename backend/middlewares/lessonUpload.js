const multer = require("multer");
const path = require("path");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith("video/");
    const folderName = isVideo
      ? "gitnest/lessons/videos"
      : "gitnest/lessons/files";

    return {
      folder: folderName,
      resource_type: "auto",
    };
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
        "Invalid file format. Only videos, PDFs, and compressed files (ZIP/RAR) are allowed.",
      ),
      false,
    );
  }
};

const lessonUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});

module.exports = lessonUpload;
