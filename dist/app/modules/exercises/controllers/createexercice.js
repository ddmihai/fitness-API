"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExercise = void 0;
const services_1 = require("../services");
const createExercise = async (req, res, next) => {
    try {
        const { name, description, muscleGroups, category, image, equipment } = req.body;
        const exercise = await services_1.exerciseService.createExercise({
            name,
            description,
            image,
            muscleGroups,
            category,
            equipment,
        });
        return res.status(201).json({
            ok: true,
            data: exercise,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createExercise = createExercise;
