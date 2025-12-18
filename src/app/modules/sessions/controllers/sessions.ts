import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { sessionService } from "../services";

export const scheduleSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id as mongoose.Types.ObjectId;
        const session = await sessionService.scheduleSession(userId, req.body);
        return res.status(201).json({ ok: true, data: session });
    } catch (error) {
        next(error);
    }
};

export const listSessions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id as mongoose.Types.ObjectId;
        const sessions = await sessionService.listSessions(userId, {
            from: req.query.from as string | undefined,
            to: req.query.to as string | undefined,
        });
        return res.status(200).json({ ok: true, data: sessions });
    } catch (error) {
        next(error);
    }
};

export const getSessionDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id as mongoose.Types.ObjectId;
        const session = await sessionService.getSession(userId, req.params.id);
        return res.status(200).json({ ok: true, data: session });
    } catch (error) {
        next(error);
    }
};

export const updateSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id as mongoose.Types.ObjectId;
        const session = await sessionService.updateSession(userId, req.params.id, req.body);
        return res.status(200).json({ ok: true, data: session });
    } catch (error) {
        next(error);
    }
};

export const completeSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id as mongoose.Types.ObjectId;
        const session = await sessionService.completeSession(userId, req.params.id, req.body);
        return res.status(200).json({ ok: true, data: session });
    } catch (error) {
        next(error);
    }
};

export const deleteSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id as mongoose.Types.ObjectId;
        const session = await sessionService.deleteSession(userId, req.params.id);
        return res.status(200).json({ ok: true, data: session });
    } catch (error) {
        next(error);
    }
};

export const getExerciseHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id as mongoose.Types.ObjectId;
        const history = await sessionService.getExerciseHistory(userId, {
            exerciseId: req.params.exerciseId,
            limit: req.query.limit ? Number(req.query.limit) : undefined,
        });
        return res.status(200).json({ ok: true, data: history });
    } catch (error) {
        next(error);
    }
};

export const getActivitySummary = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id as mongoose.Types.ObjectId;
        const activity = await sessionService.getUserActivity(userId, {
            from: req.query.from as string | undefined,
            to: req.query.to as string | undefined,
        });
        return res.status(200).json({ ok: true, data: activity });
    } catch (error) {
        next(error);
    }
};
