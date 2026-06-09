const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + " " + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = [
    "image/jpg",
    "image/png",
    "image/webp",
    "image/JPG",
    "image/jpeg",
  ];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("This type is not allow"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

module.exports = upload;
