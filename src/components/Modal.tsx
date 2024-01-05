import { useEffect } from 'react';
import { BsExclamationCircle } from 'react-icons/bs';

import { Button } from './ui/button';

interface Props {
    openModal: boolean;
    handleToggleModal: () => void;
    action: () => void;
    msg: string;
}

export default function Modal({
    openModal,
    handleToggleModal,
    action,
    msg,
}: Props): JSX.Element {
    const handleOk = (): void => {
        action();
        handleToggleModal();
    };

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent): void => {
            if (event.key === 'Escape') {
                handleToggleModal();
            }
        };

        window.addEventListener('keydown', handleEsc);

        return (): void => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [handleToggleModal]);

    return (
        <>
            {openModal && (
                <div className="fixed left-0 top-0 z-10 flex h-screen w-screen items-center justify-center bg-gray-600/50">
                    <div className=" flex flex-col items-center gap-4 rounded-md bg-white p-5 text-white">
                        <BsExclamationCircle size={40} color={'gray'} />
                        <h3 className="mb-1 text-lg font-normal text-gray-500 dark:text-gray-400">
                            {msg}
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button variant="secondary" onClick={handleToggleModal}>
                                No, cancelar.
                            </Button>

                            <Button color="failure" onClick={handleOk}>
                                Si, aceptar.
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
