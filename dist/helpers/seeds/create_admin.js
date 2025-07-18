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
exports.createAdminUser = void 0;
const env_config_1 = __importDefault(require("../../config/env.config"));
const role_model_1 = require("../../models/role.model");
const user_model_1 = __importDefault(require("../../models/user.model"));
const permissions_constants_1 = require("../constants/permissions.constants");
const createAdminUser = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminPerms = Object.values(permissions_constants_1.PERMISSIONS.admin);
        let adminRole = yield role_model_1.Role.findOne({ name: "admin" });
        if (!adminRole) {
            adminRole = yield role_model_1.Role.create({
                name: 'admin',
                displayName: 'Administrator',
                description: 'Full access to system.',
                permissions: adminPerms
            });
        }
        else {
            // Ensure role always has latest permissions
            const updatedPerms = new Set([...adminRole.permissions, ...adminPerms]);
            adminRole.permissions = Array.from(updatedPerms);
            yield adminRole.save();
        }
        // Create admin user if not exists
        const adminUser = yield user_model_1.default.findOne({ email: env_config_1.default.ADMIN_EMAIL });
        if (!adminUser) {
            yield user_model_1.default.create({
                username: 'Administrator',
                firstName: 'Admin',
                lastName: 'Admin',
                email: env_config_1.default.ADMIN_EMAIL,
                password: env_config_1.default.ADMIN_PASSW,
                roles: [adminRole._id]
            });
        }
        return;
    }
    catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
});
exports.createAdminUser = createAdminUser;
