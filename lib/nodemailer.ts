import { User } from '@prisma/client';
import nodemailer, { SentMessageInfo } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { NodemailerMockTransporter } from 'nodemailer-mock';
import { renderToString } from 'react-dom/server';

import NewUserEmail, { NewUserEmailProps } from '@/components/Emails/NewUserPassword';
import ResetPassword from '@/components/Emails/ResetPassword';

class TransporterProvider {
    private static instance: TransporterProvider;
    private transporter:
        | NodemailerMockTransporter
        | nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

    private constructor(
        transporter:
            | NodemailerMockTransporter
            | nodemailer.Transporter<SMTPTransport.SentMessageInfo>,
    ) {
        this.transporter = transporter;
    }

    private static async createTransporter() {
        if (process.env.NODE_ENV === 'development') {
            const nodemailerMock = await import('nodemailer-mock');
            return nodemailerMock.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL_ACCOUNT,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });
        } else {
            return nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL_ACCOUNT,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });
        }
    }

    public static async getInstance() {
        if (!this.instance) {
            const transporter = await this.createTransporter();
            this.instance = new this(transporter);
        }

        return this.instance.transporter;
    }
}

const logInfoInDev = (info: SentMessageInfo, html: string) => {
    if (process.env.NODE_ENV === 'development') {
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        console.log('html', html);
    }
};

const Mailer = {
    sendNewUserPassword: async (props: NewUserEmailProps) => {
        const html = renderToString(NewUserEmail(props));
        const info = (await TransporterProvider.getInstance()).sendMail({
            from: `"Administracion Tecnica Random" <${process.env.EMAIL_ACCOUNT ?? ''}>`,
            to: props.email,
            subject: 'Creacion de usuario en el Sistema de Administracion Tecnica',
            html,
        });

        logInfoInDev(info, html);

        return info;
    },
    sendResetPassword: async (user: User) => {
        const html = renderToString(ResetPassword({ user }));
        const info = (await TransporterProvider.getInstance()).sendMail({
            from: `"Administracion Tecnica Random" <${process.env.EMAIL_ACCOUNT ?? ''}>`,
            to: user.email,
            subject:
                'Creacion de nueva contraseña para tu usuario en el Sistema de Administracion Tecnica',
            html,
        });

        logInfoInDev(info, html);

        return info;
    },
} as const;

export default Mailer;
