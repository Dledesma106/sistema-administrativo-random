import { useRouter } from 'next/router';

import { useEffect } from 'react';

import { useUserContext } from '@/context/userContext/UserProvider';
import { useLogout } from '@/hooks/api/auth/useLogout';
import { UserAuthForm } from '@/modules/Login/user-auth-form';

export default function AuthenticationPage() {
    const router = useRouter();
    const query = router.query;
    const { logoutUser } = useUserContext();
    const logoutMutation = useLogout({});

    useEffect(() => {
        const logOut = query.logout;
        if (logOut) {
            logoutMutation.mutateAsync().then(() => {
                logoutUser();
            });
        }
    }, [query, logoutUser, logoutMutation]);

    return (
        <main className="container flex min-h-screen items-center justify-center">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Inicia sesión
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Ingresa tus datos para acceder a tu cuenta.
                    </p>
                </div>

                <UserAuthForm />
            </div>
        </main>
    );
}
