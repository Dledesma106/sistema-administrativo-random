import nodemailer, { SentMessageInfo, type Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import nodemailerMock from 'nodemailer-mock';
import { renderToString } from 'react-dom/server';

import NewUserEmail, { NewUserEmailProps } from '@/components/Emails/NewUserPassword';
import ResetPassword from '@/components/Emails/ResetPassword';
import TaskFinishedEmail, {
    TaskFinishedEmailProps,
} from '@/components/Emails/TaskFinished';
import { IUser } from 'backend/models/interfaces';

class TransporterProvider /* extends nodemailer.Transporter */ {
    private static instance: TransporterProvider;
    private readonly transporter: Transporter;

    constructor() {
        if (TransporterProvider.instance !== undefined) {
            return TransporterProvider.instance;
        }

        if (process.env.NODE_ENV === 'development') {
            this.transporter = nodemailerMock.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'ilene79@ethereal.email',
                    pass: 'W2vmTReQXCzgUBwdyD',
                },
            });
        } else {
            this.transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL_ACCOUNT,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });
        }

        TransporterProvider.instance = this;
    }

    getInstance(): Transporter<SMTPTransport.SentMessageInfo> {
        return this.transporter;
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
        const info = await new TransporterProvider().getInstance().sendMail({
            from: `"Administracion Tecnica Random" <${process.env.EMAIL_ACCOUNT ?? ''}>`,
            to: props.email,
            subject: 'Creacion de usuario en el Sistema de Administracion Tecnica',
            html,
        });

        logInfoInDev(info, html);

        return info;
    },
    sendResetPassword: async (user: IUser) => {
        const html = renderToString(ResetPassword({ user }));
        const info = await new TransporterProvider().getInstance().sendMail({
            from: `"Administracion Tecnica Random" <${process.env.EMAIL_ACCOUNT ?? ''}>`,
            to: user.email,
            subject:
                'Creacion de nueva contraseña para tu usuario en el Sistema de Administracion Tecnica',
            html,
        });

        logInfoInDev(info, html);

        return info;
    },
    sendTaskFinished: async (props: TaskFinishedEmailProps) => {
        const html = renderToString(TaskFinishedEmail(props));
        const info = await new TransporterProvider().getInstance().sendMail({
            from: `"Administracion Tecnica Random" <${process.env.EMAIL_ACCOUNT ?? ''}>`,
            to: props.auditor.email,
            subject: 'Tarea Finalizada',
            html,
        });

        logInfoInDev(info, html);

        return info;
    },
} as const;

export default Mailer;
