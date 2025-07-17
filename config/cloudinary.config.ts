// config/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { randomBytes } from 'crypto';
import path from 'path';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Sanitize filename
function sanitizeFilename(originalName: string): string {
    return path
        .parse(originalName)
        .name.toLowerCase()
        .replace(/[^a-z0-9-_]/g, '-') // keep safe characters
        .replace(/-+/g, '-')
        .substring(0, 50);
};

export const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        const uniqueId = randomBytes(6).toString('hex');
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
    },
});


export { cloudinary }; 
