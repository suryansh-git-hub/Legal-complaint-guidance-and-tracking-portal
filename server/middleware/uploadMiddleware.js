import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDirectory = "uploads/complaints";

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}`;

    const extension = path.extname(file.originalname);

    cb(null, `${uniqueName}${extension}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only PDF, JPG, JPEG, and PNG files are allowed"
      ),
      false
    );
  }
};

const uploadComplaintDocuments = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5,
  },

  fileFilter,
});

export { uploadComplaintDocuments };