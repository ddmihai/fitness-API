"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = require("../../../errors/AppError");
const models_1 = __importDefault(require("../../exercises/models"));
const models_2 = require("../models");
const toObjectId = (value) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
        throw new AppError_1.AppError("Invalid identifier", 400);
    }
    return new mongoose_1.default.Types.ObjectId(value);
};
const parseDate = (value) => {
    if (!value)
        return undefined;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        throw new AppError_1.AppError("Invalid date value", 400);
    }
    return date;
};
const sanitizeTemplateExercises = async (inputs) => {
    if (!Array.isArray(inputs) || inputs.length === 0) {
        throw new AppError_1.AppError("At least one exercise is required", 400);
    }
    const ids = inputs.map((item) => toObjectId(item.exerciseId));
    const exercises = await models_1.default.find({ _id: { $in: ids } });
    if (exercises.length !== ids.length) {
        throw new AppError_1.AppError("One or more exercises do not exist", 404);
    }
    const exerciseMap = new Map(exercises.map((exercise) => [exercise._id.toString(), exercise]));
    return inputs.map((input, index) => {
        const plannedRepsMax = input.plannedRepsMax ?? input.plannedRepsMin;
        if (plannedRepsMax < input.plannedRepsMin) {
            throw new AppError_1.AppError("plannedRepsMax cannot be less than plannedRepsMin", 400);
        }
        const exerciseDoc = exerciseMap.get(ids[index].toString());
        const exerciseName = exerciseDoc?.name ?? "exercise";
        return {
            exercise: ids[index],
            exerciseName,
            plannedSets: input.plannedSets,
            plannedRepsMin: input.plannedRepsMin,
            plannedRepsMax,
            restSeconds: input.restSeconds,
            order: input.order,
            notes: input.notes,
        };
    });
};
const getLatestPerformanceMap = async (userId, exerciseIds) => {
    if (!exerciseIds.length)
        return {};
    const results = await models_2.WorkoutSession.aggregate([
        {
            $match: {
                user: userId,
                status: "completed",
                "exercises.exercise": { $in: exerciseIds },
            },
        },
        { $unwind: "$exercises" },
        {
            $match: {
                "exercises.exercise": { $in: exerciseIds },
            },
        },
        { $sort: { scheduledFor: -1 } },
        {
            $group: {
                _id: "$exercises.exercise",
                entry: {
                    $first: {
                        sessionId: "$_id",
                        scheduledFor: "$scheduledFor",
                        exerciseName: "$exercises.exerciseName",
                        actualSets: "$exercises.actualSets",
                    },
                },
            },
        },
    ]);
    const map = {};
    for (const result of results) {
        map[result._id.toString()] = {
            sessionId: result.entry.sessionId,
            scheduledFor: result.entry.scheduledFor,
            exerciseName: result.entry.exerciseName,
            actualSets: result.entry.actualSets,
        };
    }
    return map;
};
exports.sessionService = {
    async createTemplate(userId, payload) {
        const exercises = await sanitizeTemplateExercises(payload.exercises);
        return models_2.WorkoutTemplate.create({
            user: userId,
            name: payload.name.trim(),
            description: payload.description?.trim(),
            color: payload.color?.trim(),
            exercises,
        });
    },
    async listTemplates(userId) {
        return models_2.WorkoutTemplate.find({ user: userId, isActive: true }).sort({ updatedAt: -1 });
    },
    async getTemplate(userId, templateId, includePerformance = false) {
        const template = await models_2.WorkoutTemplate.findOne({
            _id: toObjectId(templateId),
            user: userId,
            isActive: true,
        });
        if (!template) {
            throw new AppError_1.AppError("Template not found", 404);
        }
        if (!includePerformance) {
            return template;
        }
        const exerciseIds = template.exercises.map((exercise) => exercise.exercise);
        const performanceMap = await getLatestPerformanceMap(userId, exerciseIds);
        return {
            template,
            performance: performanceMap,
        };
    },
    async updateTemplate(userId, templateId, payload) {
        const update = {};
        if (payload.name)
            update.name = payload.name.trim();
        if (typeof payload.description === "string")
            update.description = payload.description.trim();
        if (typeof payload.color === "string")
            update.color = payload.color.trim();
        if (payload.exercises && payload.exercises.length > 0) {
            update.exercises = await sanitizeTemplateExercises(payload.exercises);
        }
        const template = await models_2.WorkoutTemplate.findOneAndUpdate({ _id: toObjectId(templateId), user: userId, isActive: true }, { $set: update }, { new: true });
        if (!template) {
            throw new AppError_1.AppError("Template not found", 404);
        }
        return template;
    },
    async deleteTemplate(userId, templateId) {
        const template = await models_2.WorkoutTemplate.findOneAndUpdate({ _id: toObjectId(templateId), user: userId, isActive: true }, { $set: { isActive: false } }, { new: true });
        if (!template) {
            throw new AppError_1.AppError("Template not found", 404);
        }
        return template;
    },
    async scheduleSession(userId, payload) {
        const template = await models_2.WorkoutTemplate.findOne({
            _id: toObjectId(payload.templateId),
            user: userId,
            isActive: true,
        });
        if (!template) {
            throw new AppError_1.AppError("Template not found", 404);
        }
        const scheduledFor = parseDate(payload.scheduledFor);
        if (!scheduledFor) {
            throw new AppError_1.AppError("scheduledFor is required", 400);
        }
        return models_2.WorkoutSession.create({
            user: userId,
            template: template._id,
            templateSnapshot: {
                name: template.name,
                color: template.color,
            },
            scheduledFor,
            notes: payload.notes?.trim(),
            exercises: template.exercises.map((exercise) => ({
                templateExerciseId: exercise._id,
                exercise: exercise.exercise,
                exerciseName: exercise.exerciseName,
                plannedSets: exercise.plannedSets,
                plannedRepsMin: exercise.plannedRepsMin,
                plannedRepsMax: exercise.plannedRepsMax,
                restSeconds: exercise.restSeconds,
                notes: exercise.notes,
                order: exercise.order,
            })),
        });
    },
    async listSessions(userId, filters) {
        const query = { user: userId };
        const from = parseDate(filters.from);
        const to = parseDate(filters.to);
        if (from || to) {
            const scheduledFilter = {};
            if (from)
                scheduledFilter.$gte = from;
            if (to)
                scheduledFilter.$lte = to;
            query.scheduledFor = scheduledFilter;
        }
        return models_2.WorkoutSession.find(query).sort({ scheduledFor: 1 });
    },
    async getSession(userId, sessionId) {
        const session = await models_2.WorkoutSession.findOne({
            _id: toObjectId(sessionId),
            user: userId,
        });
        if (!session) {
            throw new AppError_1.AppError("Session not found", 404);
        }
        return session;
    },
    async updateSession(userId, sessionId, payload) {
        const session = await models_2.WorkoutSession.findOne({
            _id: toObjectId(sessionId),
            user: userId,
        });
        if (!session) {
            throw new AppError_1.AppError("Session not found", 404);
        }
        if (payload.scheduledFor) {
            session.scheduledFor = parseDate(payload.scheduledFor);
        }
        if (payload.status) {
            session.status = payload.status;
        }
        if (typeof payload.notes === "string") {
            session.notes = payload.notes.trim();
        }
        await session.save();
        return session;
    },
    async completeSession(userId, sessionId, payload) {
        const session = await models_2.WorkoutSession.findOne({
            _id: toObjectId(sessionId),
            user: userId,
        });
        if (!session) {
            throw new AppError_1.AppError("Session not found", 404);
        }
        payload.exercises.forEach((exerciseInput) => {
            const exercise = session.exercises.id(exerciseInput.sessionExerciseId);
            if (!exercise) {
                throw new AppError_1.AppError("Session exercise not found", 404);
            }
            const actualSets = exerciseInput.actualSets?.map((set) => ({
                setNumber: set.setNumber,
                reps: set.reps,
                weight: set.weight,
                rpe: set.rpe,
                notes: set.notes?.trim(),
            })) ?? [];
            exercise.set("actualSets", actualSets);
            exercise.status = exerciseInput.status ?? "completed";
            exercise.feedback = exerciseInput.feedback?.trim();
        });
        session.status = "completed";
        session.completedAt = new Date();
        if (typeof payload.notes === "string") {
            session.notes = payload.notes.trim();
        }
        await session.save();
        return session;
    },
    async deleteSession(userId, sessionId) {
        const session = await models_2.WorkoutSession.findOne({
            _id: toObjectId(sessionId),
            user: userId,
        });
        if (!session) {
            throw new AppError_1.AppError("Session not found", 404);
        }
        await session.deleteOne();
        return session;
    },
    async getExerciseHistory(userId, options) {
        const exerciseId = toObjectId(options.exerciseId);
        const limit = Math.min(options.limit ?? 5, 20);
        const sessions = await models_2.WorkoutSession.find({
            user: userId,
            status: "completed",
            "exercises.exercise": exerciseId,
        })
            .sort({ scheduledFor: -1 })
            .limit(limit)
            .lean();
        return sessions.map((session) => ({
            sessionId: session._id,
            scheduledFor: session.scheduledFor,
            notes: session.notes,
            exercises: session.exercises
                .filter((exercise) => exercise.exercise?.toString() === exerciseId.toString())
                .map((exercise) => ({
                exerciseName: exercise.exerciseName,
                actualSets: exercise.actualSets,
                feedback: exercise.feedback,
            })),
        }));
    },
    async getUserActivity(userId, filters) {
        const from = parseDate(filters.from);
        const to = parseDate(filters.to);
        const query = {
            user: userId,
            status: "completed",
        };
        if (from || to) {
            const scheduledFilter = {};
            if (from)
                scheduledFilter.$gte = from;
            if (to)
                scheduledFilter.$lte = to;
            query.scheduledFor = scheduledFilter;
        }
        const sessions = await models_2.WorkoutSession.find(query).sort({ scheduledFor: -1 }).lean();
        const dayMap = new Map();
        sessions.forEach((session) => {
            const dayKey = new Date(session.scheduledFor).toISOString().split("T")[0];
            if (!dayMap.has(dayKey)) {
                dayMap.set(dayKey, {
                    date: dayKey,
                    totalSessions: 0,
                    totalVolumeKg: 0,
                    exercises: {},
                });
            }
            const dayEntry = dayMap.get(dayKey);
            dayEntry.totalSessions += 1;
            session.exercises.forEach((exercise) => {
                const exerciseKey = exercise.exercise?.toString() ?? exercise.exerciseName;
                if (!dayEntry.exercises[exerciseKey]) {
                    dayEntry.exercises[exerciseKey] = {
                        exerciseId: exercise.exercise?.toString() ?? "",
                        exerciseName: exercise.exerciseName,
                        setsCompleted: 0,
                        volumeKg: 0,
                    };
                }
                const exerciseEntry = dayEntry.exercises[exerciseKey];
                exerciseEntry.setsCompleted += exercise.actualSets.length;
                exercise.actualSets.forEach((set) => {
                    const volume = (set.reps ?? 0) * (set.weight ?? 0);
                    exerciseEntry.volumeKg += volume;
                    dayEntry.totalVolumeKg += volume;
                });
            });
        });
        return Array.from(dayMap.values()).map((entry) => ({
            date: entry.date,
            totalSessions: entry.totalSessions,
            totalVolumeKg: entry.totalVolumeKg,
            exercises: Object.values(entry.exercises),
        }));
    },
};
