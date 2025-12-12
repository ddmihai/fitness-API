

export enum TUserRole {
    ADMIN = 'admin',
    COLLABORATOR = 'collaborator',
    USER = 'user'
}

export type TUser = {
    _id?: string,
    name: string,
    email: string,
    password: string,
    role: TUserRole,
    createdAt?: Date,
    updatedAt?: Date
}