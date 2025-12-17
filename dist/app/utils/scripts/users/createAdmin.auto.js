"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdmin = void 0;
const user_service_1 = require("../../../modules/users/services/user.service");
const createAdmin = async () => {
    const adminDetails = {
        name: 'Daniel Mihai',
        email: 'sasdaniel@gmail.com',
        password: 'Windows1234.',
        role: 'admin'
    };
    // get user by email if not exists
    const user = await user_service_1.UserService.getUserByEmail(adminDetails.email);
    if (user)
        return;
    // create user
    const admin = await user_service_1.UserService.createUser(adminDetails);
    if (!admin)
        return;
    console.log('Admin created successfully');
};
exports.createAdmin = createAdmin;
