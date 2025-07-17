import User, { IUser } from "../../models/user.model";

/**
 * Find a user by their unique MongoDB ObjectId.
 * @param userId - The ObjectId string of the user.
 * @returns Promise resolving to the user document or null if not found.
 */
export const selectUserById = (userId: string): Promise<IUser | null> => {
    return User.findById(userId).exec();
};

/**
 * Find a user by their email address.
 * @param email - The email address of the user.
 * @returns Promise resolving to the user document or null if not found.
 */
export const selectUserByEmail = (email: string): Promise<IUser | null> => {
    return User.findOne({ email }).exec();
};

/**
 * Find a user by their username.
 * @param username - The username of the user.
 * @returns Promise resolving to the user document or null if not found.
 */
export const selectUserByUsername = (username: string): Promise<IUser | null> => {
    return User.findOne({ username }).exec();
};

/**
 * Find a user by username or email (identifier can be either).
 * @param identifier - Username or email string.
 * @returns Promise resolving to the user document or null if not found.
 */
export const selectUserByUsernameOrEmail = (identifier: string): Promise<IUser | null> => {
    return User.findOne({
        $or: [{ username: identifier }, { email: identifier }]
    }).exec();
};

/**
 * Retrieve all users.
 * @returns Promise resolving to an array of all user documents.
 */
export const selectAllUsers = (): Promise<IUser[]> => {
    return User.find().exec();
};

/**
 * Find users who have a specific role ID in their roles array.
 * @param role - The Role ObjectId string to filter users by.
 * @returns Promise resolving to an array of users who have the specified role.
 */
export const selectUsersByRole = (role: string): Promise<IUser[]> => {
    return User.find({ roles: role }).exec();
};

/**
 * Find a user by their ID and populate the roles field with full role documents.
 * @param userId - The ObjectId string of the user.
 * @returns Promise resolving to the user document with populated roles, or null if not found.
 */
export const selectUserWithRoles = (userId: string): Promise<IUser | null> => {
    return User.findById(userId).populate("roles").exec();
};
