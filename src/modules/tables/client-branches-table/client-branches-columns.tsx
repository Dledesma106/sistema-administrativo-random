import Link from 'next/link';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { useState } from 'react';
import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs';

import { CLIENT_BRANCHES_LIST_QUERY_KEY_DOMAIN } from './query';

import { fetchClient } from '@/api/fetch-client';
import {
    BranchesOfClientQuery,
    DeleteBranchDocument,
    DeleteBranchMutation,
    DeleteBranchMutationVariables,
} from '@/api/graphql';
import Modal from '@/components/Modal';
import { Badge } from '@/components/ui/badge';
import useAlert from '@/context/alertContext/useAlert';
import { getCleanErrorMessage } from '@/lib/utils';

const columnHelper = createColumnHelper<BranchesOfClientQuery['branchesOfClient'][0]>();

const RowActions = ({
    branch,
}: {
    branch: BranchesOfClientQuery['branchesOfClient'][0];
}) => {
    const [modal, setModal] = useState(false);
    const { triggerAlert } = useAlert();
    const queryClient = useQueryClient();

    const openModal = (): void => {
        setModal(true);
    };

    const closeModal = (): void => {
        setModal(false);
    };

    const deleteMutation = useMutation<
        DeleteBranchMutation,
        Error,
        DeleteBranchMutationVariables
    >({
        mutationFn: (data) => {
            return fetchClient(DeleteBranchDocument, {
                id: data.id,
            });
        },
        onSuccess: (data) => {
            if (!data.deleteBranch) {
                return;
            }

            const { branch } = data.deleteBranch;
            if (!branch) {
                throw new Error('Hubo un error al eliminar la sucursal');
            }

            queryClient.setQueryData<BranchesOfClientQuery>(
                [CLIENT_BRANCHES_LIST_QUERY_KEY_DOMAIN],
                (oldData) => {
                    if (!oldData) {
                        return oldData;
                    }

                    const newData: BranchesOfClientQuery = {
                        ...oldData,
                        branchesOfClient: oldData.branchesOfClient.filter(
                            (b) => b.id !== branch.id,
                        ),
                    };

                    return newData;
                },
            );

            triggerAlert({
                type: 'Success',
                message: `La tarea fue eliminada correctamente`,
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
        <div className="flex items-center justify-center gap-2">
            <Link
                className="rounded-lg p-0.5 hover:bg-gray-200"
                href={`/tech-admin/clients/${branch.client.id}/branches/${branch.number}`}
            >
                <BsFillPencilFill color="gray" size="15" />
            </Link>

            <button onClick={openModal} className="rounded-lg p-0.5 hover:bg-gray-200">
                <BsFillTrashFill color="gray" size="15" />
            </button>

            <Modal
                openModal={modal}
                handleToggleModal={closeModal}
                action={() => deleteMutation.mutate({ id: branch.id })}
                msg="¿Seguro que quiere eliminar esta sucursal?"
            />
        </div>
    );
};

export const getClientBranchesTableColumns = () => [
    columnHelper.accessor((row) => row.number, {
        id: 'number',
        header: 'Número',
    }),
    columnHelper.accessor((row) => row.city, {
        id: 'city',
        header: 'Ciudad',
        cell: (info) => {
            const city = info.getValue();

            return <p>{city.name}</p>;
        },
        filterFn: (row, id, ids: string[]) => {
            if (!ids) {
                return true;
            }

            return ids.includes(
                row.getValue<BranchesOfClientQuery['branchesOfClient'][0]['city']>('city')
                    .id,
            );
        },
    }),
    columnHelper.accessor((row) => row.city.province, {
        id: 'province',
        header: 'Provincia',
        cell: (info) => {
            const province = info.getValue();

            return <p>{province.name}</p>;
        },
        filterFn: (row, id, ids: string[]) => {
            if (!ids) {
                return true;
            }

            return ids.includes(
                row.getValue<
                    BranchesOfClientQuery['branchesOfClient'][0]['city']['province']
                >('province').id,
            );
        },
    }),
    columnHelper.accessor((row) => row.businesses, {
        id: 'businesses',
        header: 'Empresas',
        cell: (info) => {
            const businesses = info.getValue();

            if (businesses.length === 0) {
                return <p className="text-muted-foreground">Sin empresas</p>;
            }

            return (
                <div className="-ml-2 -mt-2 flex flex-wrap">
                    {businesses.map((business) => {
                        return (
                            <Badge
                                variant="outline"
                                key={business.id}
                                className="ml-2 mt-2"
                            >
                                {business.name}
                            </Badge>
                        );
                    })}
                </div>
            );
        },
        filterFn: (row, id, ids: string[]) => {
            if (!ids) {
                return true;
            }

            const assigned = row.getValue<BranchesOfClientQuery['branchesOfClient']>(id);
            const assignedIsInFilteredList = assigned.some((user) => {
                return ids.includes(user.id);
            });

            return assignedIsInFilteredList;
        },
    }),
    columnHelper.display({
        id: 'actions',
        cell: (props) => {
            const branch = props.row.original;

            return <RowActions branch={branch} />;
        },
    }),
];
