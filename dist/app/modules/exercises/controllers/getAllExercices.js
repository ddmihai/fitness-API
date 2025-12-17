"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllExercices = void 0;
const services_1 = require("../services");
const getAllExercices = async (req, res, next) => {
    try {
        const allexercices = await services_1.exerciseService.getExercises();
        return res.status(200).json({
            ok: true,
            data: allexercices,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllExercices = getAllExercices;
