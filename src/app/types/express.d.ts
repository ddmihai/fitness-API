import type { UserDocument } from "../modules/users/models/user.model";

declare global {
    namespace Express {
        interface Request {
            user?: UserDocument;
        }
    }
}

export { };
