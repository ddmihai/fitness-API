import ENV from "../../config/env.config";
import { Role } from "../../models/role.model";
import User from "../../models/user.model";
import { PERMISSIONS } from "../constants/permissions.constants";


export const createAdminUser = async () => {
    try {
        let adminRole = await Role.findOne({ name: "admin" });
        if (!adminRole) {
            // get all admin perms 
            const adminPerms = Object.values(PERMISSIONS.admin);
            await Role.create({
                name: 'admin',
                displayName: 'Administrator',
                description: 'Full access to system.',
                permissions: [...adminPerms]
            });
        };

        // refetch the role and get the user
        adminRole = await Role.findOne({ name: "admin" });
        let adminUser = await User.findOne({ email: ENV.ADMIN_EMAIL });

        if (!adminUser) {
            await User.create({
                username: 'Administrator',
                firstName: 'Admin',
                lastName: 'Admin',
                email: ENV.ADMIN_EMAIL,
                password: ENV.ADMIN_PASSW,
                roles: [adminRole?._id]
            });
        };

        return;
    }

    catch (error) {
        console.error('Error creating admin user:', error);
        // shutDown 
        process.exit(1);
    }
}