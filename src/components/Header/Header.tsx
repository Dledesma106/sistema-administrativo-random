import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Dropdown } from 'flowbite-react';
import { FaUserCircle } from 'react-icons/fa';

import { useUserContext } from '@/context/userContext/UserProvider';
import useLoading from '@/hooks/useLoading';
import * as apiEndpoints from '@/lib/apiEndpoints';
import fetcher from '@/lib/fetcher';

export default function Header(): JSX.Element {
    const router = useRouter();
    const { user, logoutUser, isLoggedIn } = useUserContext();
    const { startLoading, stopLoading } = useLoading();
    const logout = async (): Promise<void> => {
        try {
            startLoading();
            await fetcher.get(apiEndpoints.logoutUrl);
        } catch (error) {
            stopLoading();
            alert('Falló al intentar desloguear al usuario');
        }
        logoutUser();
        await router.push('/login');
        stopLoading();
    };

    /* useEffect(() => {
		if (isLoggedIn) void logout()
	}, []) */

    async function navigate(): Promise<void> {
        startLoading();
        await router.push('/');
        stopLoading();
    }

    const edit = async (): Promise<void> => {
        startLoading();
        await router.push('/edit-profile');
        stopLoading();
    };

    const handleNavigate = (): void => {
        void navigate();
    };

    const handleNavigateEdit = (): void => {
        void edit();
    };

    const handleLogout = (): void => {
        void logout();
    };

    return (
        <header className="fixed z-50 flex w-full items-center justify-between bg-white px-6 shadow-md">
            <div className="flex shrink-0 items-center justify-center">
                <button onClick={handleNavigate}>
                    <Image
                        height={60}
                        width={155}
                        src={'/logo_placeholder.png'}
                        alt="pet care logo"
                    />
                </button>
            </div>
            {isLoggedIn && (
                <h2 className="flex items-center text-lg">Hola {user.firstName}!</h2>
            )}
            <div className="flex justify-end">
                {isLoggedIn && (
                    <div className="flex gap-2">
                        <Dropdown label={<FaUserCircle size={18} />} color="black">
                            <Dropdown.Header>
                                <span className="block text-sm">{user.fullName}</span>
                                <span className="block truncate text-sm font-medium">
                                    {user.email}
                                </span>
                            </Dropdown.Header>
                            <Dropdown.Item onClick={handleNavigateEdit}>
                                Ajustes
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={handleLogout}>
                                Cerrar sesion
                            </Dropdown.Item>
                        </Dropdown>
                    </div>
                )}
            </div>
        </header>
    );
}
