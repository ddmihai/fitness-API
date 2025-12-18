"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActivitySummary = exports.getExerciseHistory = exports.deleteSession = exports.completeSession = exports.updateSession = exports.getSessionDetails = exports.listSessions = exports.scheduleSession = void 0;
const services_1 = require("../services");
const scheduleSession = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const session = await services_1.sessionService.scheduleSession(userId, req.body);
        return res.status(201).json({ ok: true, data: session });
    }
    catch (error) {
        next(error);
    }
};
exports.scheduleSession = scheduleSession;
const listSessions = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const sessions = await services_1.sessionService.listSessions(userId, {
            from: req.query.from,
            to: req.query.to,
        });
        return res.status(200).json({ ok: true, data: sessions });
    }
    catch (error) {
        next(error);
    }
};
exports.listSessions = listSessions;
const getSessionDetails = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const session = await services_1.sessionService.getSession(userId, req.params.id);
        return res.status(200).json({ ok: true, data: session });
    }
    catch (error) {
        next(error);
    }
};
exports.getSessionDetails = getSessionDetails;
const updateSession = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const session = await services_1.sessionService.updateSession(userId, req.params.id, req.body);
        return res.status(200).json({ ok: true, data: session });
    }
    catch (error) {
        next(error);
    }
};
exports.updateSession = updateSession;
const completeSession = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const session = await services_1.sessionService.completeSession(userId, req.params.id, req.body);
        return res.status(200).json({ ok: true, data: session });
    }
    catch (error) {
        next(error);
    }
};
exports.completeSession = completeSession;
const deleteSession = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const session = await services_1.sessionService.deleteSession(userId, req.params.id);
        return res.status(200).json({ ok: true, data: session });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteSession = deleteSession;
const getExerciseHistory = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const history = await services_1.sessionService.getExerciseHistory(userId, {
            exerciseId: req.params.exerciseId,
            limit: req.query.limit ? Number(req.query.limit) : undefined,
        });
        return res.status(200).json({ ok: true, data: history });
    }
    catch (error) {
        next(error);
    }
};
exports.getExerciseHistory = getExerciseHistory;
const getActivitySummary = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const activity = await services_1.sessionService.getUserActivity(userId, {
            from: req.query.from,
            to: req.query.to,
        });
        return res.status(200).json({ ok: true, data: activity });
    }
    catch (error) {
        next(error);
    }
};
exports.getActivitySummary = getActivitySummary;
