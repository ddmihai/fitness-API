import http from "http";
import { app } from "./app";
import { env } from "./config/env";
import { connectMongo } from "./db/mongo";
import { createAdmin } from "./utils/scripts/users/createAdmin.auto";



export const startServer = async () => {
    await connectMongo(env.MONGO_URI);
    await createAdmin();

    const server = http.createServer(app);



    server.listen(env.PORT, () => {
        console.log(`🚀 Server running on http://localhost:${env.PORT}`);
    });

    const shutdown = async () => {
        console.log("🛑 Shutting down...");
        server.close(() => console.log("✅ HTTP server closed."));
        process.exit(0);
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);

    return server;
};
