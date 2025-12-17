"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.homeRoutes = void 0;
const express_1 = require("express");
const home_controller_1 = require("../controllers/home.controller");
exports.homeRoutes = (0, express_1.Router)();
exports.homeRoutes.get("/", home_controller_1.renderHome);
