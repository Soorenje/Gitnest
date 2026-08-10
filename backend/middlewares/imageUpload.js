const multer = require("multer");
const path = require("path");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folderName = "gitnest/general";
    if (file.fieldname === "avatar") {
      folderName = "gitnest/avatars";
    } else if (file.fieldname === "cover") {
      folderName = "gitnest/courses";
    }

    return {
      folder: folderName,
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
    };
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
  const allowedExtensions = [".jpeg", ".jpg", ".png", ".webp"];
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
