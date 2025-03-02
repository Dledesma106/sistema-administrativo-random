export type NewUserEmailProps = {
    email: string;
    fullName: string;
    password: string;
};

export default function NewUserEmail({
    email,
    fullName,
    password,
}: NewUserEmailProps): JSX.Element {
    return (
        <>
            <div>
                <h3>Hola {fullName}!</h3>
            </div>
            <p>
                Estas son tus credenciales para loguearte en el Sistema Administrativo de
                Random Seguridad Integral S.R.L
                <br />
                Email: {email}
                <br />
                Contraseña: {password}
                <br />
                Esta contraseña fue autogenerada por el sistema, tené en cuenta que podes
                cambiar tu contraseña desde la aplicacion!
                <br />
                Saludos!
            </p>
        </>
    );
}
