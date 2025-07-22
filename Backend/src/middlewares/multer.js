import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload dir exists
const UPLOAD_DIR = "/tmp/uploads";
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Setup disk storage for temp files
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    cb(null, `${Date.now()}-${baseName}${ext}`);
  }
});

export const profileUpload = multer({ storage }).fields([
  { name: "profilePic", maxCount: 1 },
  { name: "resume", maxCount: 1 }
]);