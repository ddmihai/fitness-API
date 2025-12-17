"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateExercise = void 0;
const services_1 = require("../services");
const updateExercise = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description, muscleGroups, category, equipment } = req.body;
        const updated = await services_1.exerciseService.updateExercise(id, {
            name,
            description,
            muscleGroups,
            category,
            equipment,
        });
        return res.status(200).json({ ok: true, data: updated });
    }
    catch (error) {
        next(error);
    }
};
exports.updateExercise = updateExercise;
