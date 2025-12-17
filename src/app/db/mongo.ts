import mongoose from "mongoose";

export const connectMongo = async (uri: string, dbName?: string) => {
    mongoose.set("strictQuery", true);

    await mongoose.connect(uri, {
        dbName,
        autoIndex: process.env.NODE_ENV !== "production",
    });

    console.log(`📦 MongoDB connected${dbName ? ` (${dbName})` : ""}`);
};
