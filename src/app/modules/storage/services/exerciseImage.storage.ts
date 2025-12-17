import { env } from "../../../config/env";
import { supabaseAdmin } from "../../../config/supabase";




export async function uploadExerciseImage(params: {
    exerciseId: string;
    buffer: Buffer;
}) {
    const bucket = env.SUPABASE_BUCKET!;
    const path = `exercises/${params.exerciseId}/${Date.now()}.webp`;

    const { error } = await supabaseAdmin.storage
        .from(bucket)
        .upload(path, params.buffer, {
            contentType: "image/webp",
            upsert: false,
            cacheControl: "31536000",
        });

    if (error) throw error;

    // Public URL (if bucket is public)
    const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);

    return { path, publicUrl: data.publicUrl };
}

export async function deleteExerciseImage(path: string) {
    const bucket = env.SUPABASE_BUCKET!;
    const { error } = await supabaseAdmin.storage.from(bucket).remove([path]);
    if (error) throw error;
}
