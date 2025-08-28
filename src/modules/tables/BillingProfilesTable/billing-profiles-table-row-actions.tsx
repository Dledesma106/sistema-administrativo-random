import { useRouter } from 'next/navigation';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { ColumnBillingProfile } from './columns';

import Modal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeleteBillingProfile } from '@/hooks/api/billingProfile';
import { routesBuilder } from '@/lib/routes';

interface Props {
    profile: ColumnBillingProfile;
}

export function BillingProfilesTableRowActions({ profile }: Props) {
    const [modal, setModal] = useState(false);
    const router = useRouter();
    const deleteBillingProfile = useDeleteBillingProfile();

    const handleDelete = async () => {
        try {
            await deleteBillingProfile.mutateAsync({ id: profile.id });
            setModal(false);
        } catch (error) {
            console.error('Error al eliminar el perfil:', error);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="size-8 flex p-0">
                        <DotsHorizontalIcon className="size-4" />
                        <span className="sr-only">Abrir menú</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem asChild>
                        <div
                            onClick={() =>
                                router.push(
                                    routesBuilder.accounting.billingProfiles.edit(
                                        profile.id,
                                    ),
                                )
                            }
                        >
                            Editar
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <div onClick={() => setModal(true)}>Eliminar</div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Modal
                openModal={modal}
                handleToggleModal={() => setModal(false)}
                action={handleDelete}
                msg={`¿Seguro que quiere eliminar el perfil de ${profile.business.name}?`}
            />
        </>
    );
}
