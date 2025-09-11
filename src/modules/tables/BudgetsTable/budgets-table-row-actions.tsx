import { useRouter } from 'next/router';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { fetchClient } from '@/api/fetch-client';
import {
    DeleteBudgetDocument,
    DeleteBudgetMutation,
    DeleteBudgetMutationVariables,
    GetBudgetsQuery,
} from '@/api/graphql';
import Modal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useAlert from '@/context/alertContext/useAlert';
import { BUDGETS_QUERY_KEY } from '@/hooks/api/budget/useGetBudgets';
import { routesBuilder } from '@/lib/routes';
import { getCleanErrorMessage } from '@/lib/utils';

interface Props {
    budget: NonNullable<GetBudgetsQuery['budgets']>[number];
}

export function BudgetsTableRowActions({ budget }: Props) {
    const [modal, setModal] = useState(false);
    const router = useRouter();
    const { triggerAlert } = useAlert();
    const queryClient = useQueryClient();

    const openModal = (e: React.MouseEvent): void => {
        e.stopPropagation();
        setModal(true);
    };

    const closeModal = (e?: React.MouseEvent): void => {
        e?.stopPropagation();
        setModal(false);
    };

    const deleteMutation = useMutation<
        DeleteBudgetMutation,
        Error,
        DeleteBudgetMutationVariables
    >({
        mutationFn: (data) => {
            return fetchClient(DeleteBudgetDocument, {
                id: data.id,
            });
        },
        onSuccess: (data) => {
            if (!data.deleteBudget?.success) {
                throw new Error(
                    data.deleteBudget?.message ||
                        'Hubo un error al eliminar el presupuesto',
                );
            }

            queryClient.invalidateQueries({
                queryKey: [BUDGETS_QUERY_KEY],
            });

            triggerAlert({
                type: 'Success',
                message: `El presupuesto fue eliminado correctamente`,
            });
        },
        onError: (error) => {
            triggerAlert({
                type: 'Failure',
                message: getCleanErrorMessage(error),
            });
        },
    });

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex h-8 w-8 p-0">
                        <DotsHorizontalIcon className="h-4 w-4" />
                        <span className="sr-only">Abrir menú</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem asChild>
                        <div
                            onClick={() =>
                                router.push(
                                    routesBuilder.accounting.budgets.edit(budget.id),
                                )
                            }
                        >
                            Editar
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <button className="w-full cursor-default" onClick={openModal}>
                            Eliminar
                        </button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Modal
                openModal={modal}
                handleToggleModal={closeModal}
                action={() => deleteMutation.mutate({ id: budget.id })}
                msg={`¿Seguro que quiere eliminar el presupuesto "${budget.subject}" de ${budget.billingProfile.business.name}?`}
            />
        </>
    );
}
