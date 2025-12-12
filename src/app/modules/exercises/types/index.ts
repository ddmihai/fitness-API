export type TExercise = {
    _id?: string;

    name: string;
    description: string;
    muscleGroups: string[];
    category: string[];
    equipment: string[];
    image?: string;

    createdAt?: Date;
    updatedAt?: Date;
};


export type CreateExerciseDTO = {
    name: string;
    description: string;
    muscleGroups: string[];
    image?: string;
    category: string[];
    equipment: string[];
    createdAt?: Date;
    updatedAt?: Date;
};
