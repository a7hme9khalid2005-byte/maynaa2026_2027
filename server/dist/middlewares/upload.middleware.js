"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadReceipt = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const env_js_1 = require("../config/env.js");
// ضمان وجود مجلد الرفع
const uploadDir = path_1.default.resolve(process.cwd(), env_js_1.ENV.UPLOAD_DIR);
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${uniqueSuffix}${ext}`);
    },
});
const fileFilter = (_req, file, cb) => {
    const allowedMimes = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'application/pdf',
    ];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('الملف غير مدعوم! الصيغ المسموحة: JPG, PNG, WEBP, PDF فقط.'));
    }
};
exports.uploadReceipt = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: env_js_1.ENV.MAX_FILE_SIZE_MB * 1024 * 1024,
    },
    fileFilter,
});
