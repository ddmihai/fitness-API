"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const nodemailer_express_handlebars_1 = __importDefault(require("nodemailer-express-handlebars"));
const path_1 = __importDefault(require("path"));
const express_handlebars_1 = require("express-handlebars");
const env_config_1 = __importDefault(require("./env.config"));
// Create Nodemailer transporter
const transporter = nodemailer_1.default.createTransport({
    host: env_config_1.default.SMTP_HOST,
    port: Number(env_config_1.default.SMTP_PORT),
    secure: env_config_1.default.SMTP_SECURE === 'true',
    auth: {
        user: env_config_1.default.SMTP_USER,
        pass: env_config_1.default.SMTP_PASS,
    },
});
// Create handlebars engine instance
const hbsEngine = (0, express_handlebars_1.create)({
    extname: '.hbs',
    layoutsDir: path_1.default.resolve(__dirname, '../views/layouts'),
    partialsDir: path_1.default.resolve(__dirname, '../views/partials'),
    defaultLayout: false,
});
// Handlebars options for nodemailer-express-handlebars
const handlebarOptions = {
    viewEngine: hbsEngine,
    viewPath: path_1.default.resolve(__dirname, '../views'),
    extName: '.hbs',
};
// Attach handlebars plugin to transporter
transporter.use('compile', (0, nodemailer_express_handlebars_1.default)(handlebarOptions));
// The wrapper sendEmail function
function sendEmail(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { to, subject, template, context = {} } = options, rest = __rest(options, ["to", "subject", "template", "context"]);
        // Prepare the sendMail options
        const mailOptions = Object.assign({ from: env_config_1.default.SMTP_USER, to,
            subject }, rest);
        // Nodemailer typings don't include 'template' and 'context',
        // but the plugin expects them.
        // We create a casted object that includes those extra props.
        const mailOptionsWithTemplate = mailOptions;
        mailOptionsWithTemplate.template = template;
        mailOptionsWithTemplate.context = context;
        try {
            const info = yield transporter.sendMail(mailOptionsWithTemplate);
            console.log('Email sent:', info.messageId);
            return info;
        }
        catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    });
}
exports.default = transporter;
