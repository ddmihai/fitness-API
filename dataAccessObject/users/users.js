"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectUserWithRoles = exports.selectUsersByRole = exports.selectAllUsers = exports.selectUserByUsernameOrEmail = exports.selectUserByUsername = exports.selectUserByEmail = exports.selectUserById = void 0;
const user_model_1 = __importDefault(require("../../models/user.model"));
/**
 * Find a user by their unique MongoDB ObjectId.
 * @param userId - The ObjectId string of the user.
 * @returns Promise resolving to the user document or null if not found.
 */
const selectUserById = (userId) => {
    return user_model_1.default.findById(userId).exec();
};
exports.selectUserById = selectUserById;
/**
 * Find a user by their email address.
 * @param email - The email address of the user.
 * @returns Promise resolving to the user document or null if not found.
 */
const selectUserByEmail = (email) => {
    return user_model_1.default.findOne({ email }).exec();
};
exports.selectUserByEmail = selectUserByEmail;
/**
 * Find a user by their username.
 * @param username - The username of the user.
 * @returns Promise resolving to the user document or null if not found.
 */
const selectUserByUsername = (username) => {
    return user_model_1.default.findOne({ username }).exec();
};
exports.selectUserByUsername = selectUserByUsername;
/**
 * Find a user by username or email (identifier can be either).
 * @param identifier - Username or email string.
 * @returns Promise resolving to the user document or null if not found.
 */
const selectUserByUsernameOrEmail = (identifier) => {
    return user_model_1.default.findOne({
        $or: [{ username: identifier }, { email: identifier }]
    }).exec();
};
exports.selectUserByUsernameOrEmail = selectUserByUsernameOrEmail;
/**
 * Retrieve all users.
 * @returns Promise resolving to an array of all user documents.
 */
const selectAllUsers = () => {
    return user_model_1.default.find().exec();
};
exports.selectAllUsers = selectAllUsers;
/**
 * Find users who have a specific role ID in their roles array.
 * @param role - The Role ObjectId string to filter users by.
 * @returns Promise resolving to an array of users who have the specified role.
 */
const selectUsersByRole = (role) => {
    return user_model_1.default.find({ roles: role }).exec();
};
exports.selectUsersByRole = selectUsersByRole;
/**
 * Find a user by their ID and populate the roles field with full role documents.
 * @param userId - The ObjectId string of the user.
 * @returns Promise resolving to the user document with populated roles, or null if not found.
 */
const selectUserWithRoles = (userId) => {
    return user_model_1.default.findById(userId).populate("roles").exec();
};
exports.selectUserWithRoles = selectUserWithRoles;
