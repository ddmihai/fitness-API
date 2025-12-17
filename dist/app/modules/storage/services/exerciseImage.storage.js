"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadExerciseImage = uploadExerciseImage;
exports.deleteExerciseImage = deleteExerciseImage;
const env_1 = require("../../../config/env");
const supabase_1 = require("../../../config/supabase");
async function uploadExerciseImage(params) {
    const bucket = env_1.env.SUPABASE_BUCKET;
    const path = `exercises/${params.exerciseId}/${Date.now()}.webp`;
    const { error } = await supabase_1.supabaseAdmin.storage
        .from(bucket)
        .upload(path, params.buffer, {
        contentType: "image/webp",
        upsert: false,
        cacheControl: "31536000",
    });
    if (error)
        throw error;
    // Public URL (if bucket is public)
    const { data } = supabase_1.supabaseAdmin.storage.from(bucket).getPublicUrl(path);
    return { path, publicUrl: data.publicUrl };
}
async function deleteExerciseImage(path) {
    const bucket = env_1.env.SUPABASE_BUCKET;
    const { error } = await supabase_1.supabaseAdmin.storage.from(bucket).remove([path]);
    if (error)
        throw error;
}
