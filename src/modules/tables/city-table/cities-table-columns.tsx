import Link from 'next/link';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { useState } from 'react';
import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs';

import { CITIES_LIST_QUERY_KEY_DOMAIN } from './query';

import { fetchClient } from '@/api/fetch-client';
import {
    CitiesQuery,
    DeleteCityDocument,
    DeleteCityMutation,
    DeleteCityMutationVariables,
} from '@/api/graphql';
import Modal from '@/components/Modal';
import useAlert from '@/context/alertContext/useAlert';
import { getCleanErrorMessage } from '@/lib/utils';

type City = CitiesQuery['cities'][number];

const columnHelper = createColumnHelper<City>();

const RowActions = ({ city }: { city: City }) => {
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
        DeleteCityMutation,
        Error,
        DeleteCityMutationVariables
    >({
        mutationFn: (data) => {
            return fetchClient(DeleteCityDocument, {
                id: data.id,
            });
        },
        onSuccess: (data) => {
            if (!data.deleteCity) {
                return;
            }

            const { city } = data.deleteCity;
            if (!city) {
                throw new Error('Hubo un error al eliminar la ciudad');
            }

            queryClient.invalidateQueries({
                queryKey: [CITIES_LIST_QUERY_KEY_DOMAIN],
            });

            triggerAlert({
                type: 'Success',
                message: `La ciudad fue eliminada correctamente`,
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
                href={`/tech-admin/cities/${city.id}`}
            >
                <BsFillPencilFill color="gray" size="15" />
            </Link>

            <button onClick={openModal} className="rounded-lg p-0.5 hover:bg-gray-200">
                <BsFillTrashFill color="gray" size="15" />
            </button>

            <Modal
                openModal={modal}
                handleToggleModal={closeModal}
                action={() => deleteMutation.mutate({ id: city.id })}
                msg="¿Seguro que quiere eliminar esta ciudad?"
            />
        </div>
    );
};

export const CITIES_TABLE_COLUMNS = [
    columnHelper.accessor((row) => row, {
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

            return ids.includes(row.getValue<City>(id).id);
        },
    }),
    columnHelper.accessor((row) => row.province, {
        id: 'provinceId',
        header: 'Provincia',
        cell: (info) => {
            const province = info.getValue();

            return <p>{province.name}</p>;
        },
        filterFn: (row, id, ids: string[]) => {
            if (!ids) {
                return true;
            }

            return ids.includes(row.getValue<City['province']>(id).id);
        },
    }),
    columnHelper.display({
        id: 'actions',
        cell: (props) => {
            const city = props.row.original;

            return <RowActions city={city} />;
        },
    }),
];
