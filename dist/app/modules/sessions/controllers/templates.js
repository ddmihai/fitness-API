"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTemplate = exports.updateTemplate = exports.getTemplateDetails = exports.listTemplates = exports.createTemplate = void 0;
const services_1 = require("../services");
const createTemplate = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const template = await services_1.sessionService.createTemplate(userId, req.body);
        return res.status(201).json({ ok: true, data: template });
    }
    catch (error) {
        next(error);
    }
};
exports.createTemplate = createTemplate;
const listTemplates = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const templates = await services_1.sessionService.listTemplates(userId);
        return res.status(200).json({ ok: true, data: templates });
    }
    catch (error) {
        next(error);
    }
};
exports.listTemplates = listTemplates;
const getTemplateDetails = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const includePerformance = req.query.includePerformance === "true";
        const result = await services_1.sessionService.getTemplate(userId, req.params.id, includePerformance);
        return res.status(200).json({ ok: true, data: result });
    }
    catch (error) {
        next(error);
    }
};
exports.getTemplateDetails = getTemplateDetails;
const updateTemplate = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const template = await services_1.sessionService.updateTemplate(userId, req.params.id, req.body);
        return res.status(200).json({ ok: true, data: template });
    }
    catch (error) {
        next(error);
    }
};
exports.updateTemplate = updateTemplate;
const deleteTemplate = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const template = await services_1.sessionService.deleteTemplate(userId, req.params.id);
        return res.status(200).json({ ok: true, data: template });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteTemplate = deleteTemplate;
