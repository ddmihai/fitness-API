import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';
import { create } from 'express-handlebars';
import ENV from './env.config';

type Attachment = NonNullable<nodemailer.SendMailOptions['attachments']>[number];

// Extended interface for your email sending params (template + context)
interface ExtendedMailOptions {
    to: string | string[];
    subject: string;
    template: string;    // handlebars template file name (without .hbs)
    context?: object;    // data for handlebars template
    // plus any other Nodemailer SendMailOptions properties you want
    cc?: string | string[];
    bcc?: string | string[];
    attachments?: Attachment[];
}

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: ENV.SMTP_HOST,
    port: Number(ENV.SMTP_PORT),
    secure: ENV.SMTP_SECURE === 'true',
    auth: {
        user: ENV.SMTP_USER,
        pass: ENV.SMTP_PASS,
    },
});

// Create handlebars engine instance
const hbsEngine = create({
    extname: '.hbs',
    layoutsDir: path.resolve(__dirname, '../views/layouts'),
    partialsDir: path.resolve(__dirname, '../views/partials'),
    defaultLayout: false,
});

// Handlebars options for nodemailer-express-handlebars
const handlebarOptions = {
    viewEngine: hbsEngine,
    viewPath: path.resolve(__dirname, '../views'),
    extName: '.hbs',
};

// Attach handlebars plugin to transporter
transporter.use('compile', hbs(handlebarOptions));

// The wrapper sendEmail function
export async function sendEmail(options: ExtendedMailOptions) {
    const { to, subject, template, context = {}, ...rest } = options;

    // Prepare the sendMail options
    const mailOptions: nodemailer.SendMailOptions = {
        from: ENV.SMTP_USER,
        to,
        subject,
        ...rest
    };

    // Nodemailer typings don't include 'template' and 'context',
    // but the plugin expects them.
    // We create a casted object that includes those extra props.
    const mailOptionsWithTemplate = mailOptions as nodemailer.SendMailOptions & {
        template: string;
        context: object;
    };

    mailOptionsWithTemplate.template = template;
    mailOptionsWithTemplate.context = context;

    try {
        const info = await transporter.sendMail(mailOptionsWithTemplate);
        console.log('Email sent:', info.messageId);
        return info;
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

export default transporter;
