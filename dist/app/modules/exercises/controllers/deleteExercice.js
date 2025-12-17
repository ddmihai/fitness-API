"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExercise = void 0;
const services_1 = require("../services");
const deleteExercise = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedExercise = await services_1.exerciseService.deleteExercise(id);
        return res.status(200).json({
            ok: true,
            data: deletedExercise,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteExercise = deleteExercise;
