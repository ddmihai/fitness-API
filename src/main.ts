import { startServer } from "./app/server";

startServer().catch((err: any) => {
    console.error("Fatal startup error:", err);
    process.exit(1);
});
