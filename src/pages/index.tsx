import Link from 'next/link';

const Index = (): JSX.Element => {
    return (
        <div className="space-y-4">
            <p>Bienvenido al panel de control de Random SRL.</p>

            <p>
                Puedes navegar por las diferentes secciones del menú lateral para acceder
                a las funcionalidades de la aplicación.
            </p>

            <p>
                Puedes empezar por{' '}
                <Link className="font-bold underline hover:text-gray-500" href="/tasks">
                    la sección de Tareas
                </Link>
                .
            </p>
        </div>
    );
};

export default Index;
