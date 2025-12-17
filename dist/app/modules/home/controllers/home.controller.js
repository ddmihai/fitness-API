"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderHome = void 0;
const renderHome = (req, res) => {
    res.status(200).render("pages/home", {
        title: "Fitness API",
        message: "Server-rendered Handlebars is working ✅",
    });
};
exports.renderHome = renderHome;
