import ENV from "../../config/env.config";
import { Role } from "../../models/role.model";
import User from "../../models/user.model";
import { PERMISSIONS } from "../constants/permissions.constants";



export const createAdminUser = async () => {
    try {
        const adminPerms = Object.values(PERMISSIONS.admin);

        let adminRole = await Role.findOne({ name: "admin" });

        if (!adminRole) {
            adminRole = await Role.create({
                name: 'admin',
                displayName: 'Administrator',
                description: 'Full access to system.',
                permissions: adminPerms
            });
        } else {
            // Ensure role always has latest permissions
            const updatedPerms = new Set([...adminRole.permissions, ...adminPerms]);
            adminRole.permissions = Array.from(updatedPerms);
            await adminRole.save();
        }

        // Create admin user if not exists
        const adminUser = await User.findOne({ email: ENV.ADMIN_EMAIL });
        if (!adminUser) {
            await User.create({
                username: 'Administrator',
                firstName: 'Admin',
                lastName: 'Admin',
                email: ENV.ADMIN_EMAIL,
                password: ENV.ADMIN_PASSW,
                roles: [adminRole._id]
            });
        }

        return;
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
};
