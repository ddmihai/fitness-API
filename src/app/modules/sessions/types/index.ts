export type TemplateExerciseInput = {
    exerciseId: string;
    plannedSets: number;
    plannedRepsMin: number;
    plannedRepsMax?: number;
    restSeconds?: number;
    order: number;
    notes?: string;
};

export type CreateTemplateDTO = {
    name: string;
    description?: string;
    color?: string;
    exercises: TemplateExerciseInput[];
};

export type UpdateTemplateDTO = Partial<Omit<CreateTemplateDTO, "exercises">> & {
    exercises?: TemplateExerciseInput[];
};

export type ScheduleSessionDTO = {
    templateId: string;
    scheduledFor: string;
    notes?: string;
};

export type ListSessionsFilters = {
    from?: string;
    to?: string;
};

export type UpdateSessionDTO = {
    scheduledFor?: string;
    status?: "planned" | "cancelled" | "missed";
    notes?: string;
};

export type SessionExerciseCompletionInput = {
    sessionExerciseId: string;
    actualSets: Array<{
        setNumber?: number;
        reps?: number;
        weight?: number;
        rpe?: number;
        notes?: string;
    }>;
    feedback?: string;
    status?: "pending" | "completed" | "skipped";
};

export type CompleteSessionDTO = {
    exercises: SessionExerciseCompletionInput[];
    notes?: string;
};

export type ExerciseHistoryFilter = {
    exerciseId: string;
    limit?: number;
};

export type ActivityFilter = {
    from?: string;
    to?: string;
};
