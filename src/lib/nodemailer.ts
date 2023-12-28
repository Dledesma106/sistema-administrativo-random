import nodemailer, { type Transporter } from 'nodemailer';
import { renderToString } from 'react-dom/server';

import NewUserPassword from '@/components/Emails/NewUserPassword';
import ResetPassword from '@/components/Emails/ResetPassword';
import { IUser } from 'backend/models/interfaces';

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
            secure: true,
            auth: {
                user: process.env.EMAIL_ACCOUNT,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        TransporterProvider.instance = this;
    }

    getInstance(): Transporter {
        return this.transporter;
    }
}

const Mailer = {
    sendNewUserPassword: async (user: IUser) => {
        const info = await new TransporterProvider().getInstance().sendMail({
            from: `"Administracion Tecnica Random" <${process.env.EMAIL_ACCOUNT ?? ''}>`,
            to: user.email,
            subject: 'Creacion de usuario en el Sistema de Administracion Tecnica',
            html: renderToString(
                NewUserPassword({
                    user,
                }),
            ),
        });
        return info;
    },
    sendResetPassword: async (user: IUser) => {
        const info = await new TransporterProvider().getInstance().sendMail({
            from: `"Administracion Tecnica Random" <${process.env.EMAIL_ACCOUNT ?? ''}>`,
            to: user.email,
            subject:
                'Creacion de nueva contraseña para tu usuario en el Sistema de Administracion Tecnica',
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
