"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinary = exports.storage = void 0;
// config/cloudinary.ts
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const crypto_1 = require("crypto");
const path_1 = __importDefault(require("path"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Sanitize filename
function sanitizeFilename(originalName) {
    return path_1.default
        .parse(originalName)
        .name.toLowerCase()
        .replace(/[^a-z0-9-_]/g, '-') // keep safe characters
        .replace(/-+/g, '-')
        .substring(0, 50);
}
;
exports.storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: (req, file) => __awaiter(void 0, void 0, void 0, function* () {
        const uniqueId = (0, crypto_1.randomBytes)(6).toString('hex');
        const safeName = sanitizeFilename(file.originalname);
        return {
            folder: 'fitness-images',
            format: 'webp',
            public_id: `${safeName}-${uniqueId}`,
            transformation: [
                {
                    width: 800,
                    height: 800,
                    crop: 'fill',
                    gravity: 'auto',
                    quality: 'auto',
                    fetch_format: 'auto',
                },
            ],
        };
    }),
});
