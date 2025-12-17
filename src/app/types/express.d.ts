import type { UserDocument } from "../modules/users/models";

declare global {
    namespace Express {
        interface Request {
            user?: UserDocument;
        }
    }
}

export { };
