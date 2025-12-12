import type { Request, Response } from "express";

export const renderHome = (req: Request, res: Response) => {
    res.status(200).render("pages/home", {
        title: "Fitness API",
        message: "Server-rendered Handlebars is working ✅",
    });
};
