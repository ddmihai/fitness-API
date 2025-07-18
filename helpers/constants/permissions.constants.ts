export const PERMISSIONS = {
    admin: {
        MANAGE_USERS: "manage_users",
        MANAGE_ROLES: "manage_roles",
        MANAGE_CONTENT: "manage_content",
        VIEW_ADMIN_DASHBOARD: "view_admin_dashboard",

        // EXERCICES
        CREATE_EXERCICES: "create_exercices",
        DELETE_EXERCICE: "delete_exercice"

    },
    trainer: {
        CREATE_PERSONAL_WORKOUTS: "create_personal_workouts",
        MANAGE_CLIENTS: "manage_clients",
        MANAGE_CONTENT: "manage_content",
        VIEW_TRAINER_DASHBOARD: "view_trainer_dashboard",
        VIEW_CLIENT_PROGRESS: "view_client_progress",
        CREATE_GROUP_WORKOUTS: "create_group_workouts",

        // exercices
        CREATE_EXERCICES: "create_exercices",
        DELETE_EXERCICE: "delete_exercice"
    },
    client: {
        CLIENT_BASIC: "client_basic"
    }
};
