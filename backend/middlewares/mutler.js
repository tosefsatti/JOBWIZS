import multer from "multer";

const storage = multer.memoryStorage();
// match the front-end FormData key:
export const singleUpload = multer({ storage }).single("file");
