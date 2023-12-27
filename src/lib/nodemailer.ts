import nodemailer, { type Transporter } from 'nodemailer';
import { renderToString } from 'react-dom/server';

import NewUserPassword from '@/components/Emails/NewUserPassword';
import ResetPassword from '@/components/Emails/ResetPassword';
import { type ICity } from 'backend/models/interfaces';
import { type Role } from 'backend/models/types';

class TransporterProvider /* extends nodemailer.Transporter */ {
    private static instance: TransporterProvider;
    private readonly transporter: Transporter;

    constructor() {
        if (TransporterProvider.instance !== undefined) {
            return TransporterProvider.instance;
        }
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_ACCOUNT, // generated ethereal user
                pass: process.env.EMAIL_PASSWORD, // generated ethereal password
            },
        });
        TransporterProvider.instance = this;
    }

    getInstance(): Transporter {
        return this.transporter;
    }
}

export interface NewUser {
    firstName: string;
    lastName: string;
    fullName: string;
    city?: ICity;
    roles?: Role[];
    email: string;
    password: string;
}

const Mailer = {
    sendNewUserPassword: async (user: NewUser) => {
        const info = await new TransporterProvider().getInstance().sendMail({
            from: `"Administracion Tecnica Random" <${process.env.EMAIL_ACCOUNT ?? ''}>`, // sender address
            to: user.email, // list of receivers
            subject: 'Creacion de usuario en el Sistema de Administracion Tecnica', // Subject line
            html: renderToString(
                NewUserPassword({
                    user,
                }),
            ),
        });
        return info;
    },
    sendResetPassword: async (user: NewUser) => {
        const info = await new TransporterProvider().getInstance().sendMail({
            from: `"Administracion Tecnica Random" <${process.env.EMAIL_ACCOUNT ?? ''}>`, // sender address
            to: user.email, // list of receivers
            subject:
                'Creacion de nueva contraseña para tu usuario en el Sistema de Administracion Tecnica', // Subject line
            // text: "Hello world?", // plain text body
            html: renderToString(
                ResetPassword({
                    user,
                }),
            ),
        });

        return info;
    },
};

export default Mailer;
