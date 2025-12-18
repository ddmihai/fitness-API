import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { sessionService } from "../services";

export const createTemplate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id as mongoose.Types.ObjectId;
        const template = await sessionService.createTemplate(userId, req.body);
        return res.status(201).json({ ok: true, data: template });
    } catch (error) {
        next(error);
    }
};

export const listTemplates = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id as mongoose.Types.ObjectId;
        const templates = await sessionService.listTemplates(userId);
        return res.status(200).json({ ok: true, data: templates });
    } catch (error) {
        next(error);
    }
};

export const getTemplateDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id as mongoose.Types.ObjectId;
        const includePerformance = req.query.includePerformance === "true";
        const result = await sessionService.getTemplate(userId, req.params.id, includePerformance);
        return res.status(200).json({ ok: true, data: result });
    } catch (error) {
        next(error);
    }
};

export const updateTemplate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id as mongoose.Types.ObjectId;
        const template = await sessionService.updateTemplate(userId, req.params.id, req.body);
        return res.status(200).json({ ok: true, data: template });
    } catch (error) {
        next(error);
    }
};

export const deleteTemplate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id as mongoose.Types.ObjectId;
        const template = await sessionService.deleteTemplate(userId, req.params.id);
        return res.status(200).json({ ok: true, data: template });
    } catch (error) {
        next(error);
    }
};
