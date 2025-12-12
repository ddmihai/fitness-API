import { UserService } from "../../../modules/users/services/user.service";

export const createAdmin = async () => {
    const adminDetails = {
        name: 'Daniel Mihai',
        email: 'sasdaniel@gmail.com',
        password: 'Windows1234.',
        role: 'admin'
    } as const;

    // get user by email if not exists
    const user = await UserService.getUserByEmail(adminDetails.email);
    if (user) return;

    // create user
    const admin = await UserService.createUser(adminDetails);
    if (!admin) return;
    console.log('Admin created successfully');
}