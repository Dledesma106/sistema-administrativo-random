import { type NewUser } from 'lib/nodemailer'

export default function ResetPassword({ user }: { user: NewUser }) {
    return (
        <>
            <div>
                <h3>Hola {user.fullName}!</h3>
            </div>
            <p>
                Solicitaste una nueva contraseña
                <br/>
                Esta es tu nueva contraseña para loguearte en el Sistema Administrativo de Random Seguridad Integral S.R.L
                <br/>
                Contraseña: {user.password}
                <br/>
                Esta contraseña fue autogenerada por el sistema, tené en cuenta que podes cambiar tu contraseña desde la aplicacion!
                <br/>
                Saludos!
            </p>
        </>
    )
}
