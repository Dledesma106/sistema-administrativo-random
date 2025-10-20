import { User } from '@prisma/client';
import nodemailer, { SentMessageInfo } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { NodemailerMockTransporter } from 'nodemailer-mock';
import { renderToString } from 'react-dom/server';

import { prisma } from './prisma';

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
    sendMail: async (mailOptions: {
        from: string;
        to: string;
        subject: string;
        html: string;
    }) => {
        const info = (await TransporterProvider.getInstance()).sendMail(mailOptions);

        logInfoInDev(info, mailOptions.html);

        return info;
    },
    /**
     * Envía notificación por email a usuarios específicos
     * @param userIds Array de IDs de los usuarios a notificar
     * @param subject Asunto del email
     * @param message Mensaje del email
     */
    sendEmailNotification: async (
        userIds: string[],
        subject: string,
        message: string,
    ) => {
        if (!userIds || userIds.length === 0) {
            console.log('No user IDs provided for email notification.');
            return;
        }

        try {
            // Obtener usuarios por IDs (sin filtro de roles)
            const users = await prisma.user.findMany({
                where: {
                    id: { in: userIds },
                },
                select: {
                    email: true,
                    fullName: true,
                },
            });

            if (users.length === 0) {
                console.log('No users found for email notification.');
                return;
            }

            // Enviar email a cada usuario
            for (const user of users) {
                try {
                    await Mailer.sendMail({
                        from: `"Administracion Tecnica Random" <${process.env.EMAIL_ACCOUNT ?? ''}>`,
                        to: user.email,
                        subject,
                        html: `
                            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                                <h2 style="color: #333;">Notificación del Sistema</h2>
                                <p>Hola ${user.fullName},</p>
                                <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
                                    ${message}
                                </div>
                                <p>Saludos,<br>Equipo de Administración Técnica</p>
                            </div>
                        `,
                    });
                } catch (error) {
                    console.error(`Error sending email to ${user.email}:`, error);
                }
            }

            console.log(`Email notifications sent to ${users.length} users.`);
        } catch (error) {
            console.error('Error in sendEmailNotification service:', error);
        }
    },
} as const;

export default Mailer;
