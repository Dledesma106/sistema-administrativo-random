import { useEffect } from 'react';
import { BsExclamationCircle } from 'react-icons/bs';

import { Button } from './ui/button';

interface Props {
    openModal: boolean;
    handleToggleModal: () => void;
    action: (e: React.MouseEvent) => void;
    msg: string;
}

export default function Modal({
    openModal,
    handleToggleModal,
    action,
    msg,
}: Props): JSX.Element {
    const handleOk = (e: React.MouseEvent): void => {
        e.stopPropagation();
        action(e);
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
                <div className="fixed left-0 top-0 z-10 flex h-screen w-screen items-center justify-center bg-background/50">
                    <div className=" flex flex-col items-center gap-4 rounded-md border border-border bg-background p-5 text-foreground">
                        <BsExclamationCircle size={40} color={'gray'} />
                        <h3 className="mb-1 text-lg font-normal text-foreground">
                            {msg}
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button variant="secondary" onClick={handleToggleModal}>
                                No, cancelar.
                            </Button>

                            <Button color="failure" onClick={(e) => handleOk(e)}>
                                Si, aceptar.
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
