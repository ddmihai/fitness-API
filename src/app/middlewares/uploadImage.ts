import multer from "multer";

export const uploadImage = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (_req, file, cb) => {
        const ok = ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype);
        // cast cb to a compatible signature so we can pass Error | null without a type error
        (cb as unknown as (err: Error | null, acceptFile: boolean) => void)(
            ok ? null : new Error("Invalid file type"),
            ok
        );
    },
});
