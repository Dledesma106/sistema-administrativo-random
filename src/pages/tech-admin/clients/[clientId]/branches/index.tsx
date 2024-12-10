import { type GetServerSidePropsContext } from 'next';

import {  } from '@/components/';
import TitleButton from '@/components/TitleButton';
import { ClientBranchesTable } from '@/modules/tables/client-branches-table';
import { prisma } from 'lib/prisma';

type ClientBranchesViewProps = Awaited<ReturnType<typeof getProps>>;

export type ValidClientBranchesViewProps = {
    client: {
        id: string;
        name: string;
    };
    cities: {
        id: string;
        name: string;
        province: {
            id: string;
            name: string;
        };
    }[];
    provinces: {
        id: string;
        name: string;
    }[];
    businesses: {
        id: string;
        name: string;
    }[];
};

export default function ClientView({
    client,
    cities,
    provinces,
    businesses,
}: ClientBranchesViewProps): JSX.Element {
    if (!client) {
        return (
            <>
                <div className="flex min-h-screen items-center justify-center">
                    <p className="text-2xl">No se encontró al cliente</p>
                </div>
            </>
        );
    }

    const name = `Cliente: ${client.name}`;
    return (
        <>
            <main>
                <TitleButton
                    title={name}
                    path={`/tech-admin/clients/${client.id}/branches/new`}
                    nameButton="Agregar sucursal"
                />

                <ClientBranchesTable
                    client={client}
                    cities={cities}
                    provinces={provinces}
                    businesses={businesses}
                />
            </main>
        </>
    );
}

export async function getServerSideProps(
    ctx: GetServerSidePropsContext,
): Promise<{ props: ClientBranchesViewProps }> {
    const { params } = ctx;
    if (!params) {
        return {
            props: {} as ClientBranchesViewProps,
        };
    }

    const clientId = params.clientId as string;
    const props = await getProps(clientId);

    return {
        props: JSON.parse(JSON.stringify(props)),
    };
}

const getProps = async (clientId: string) => {
    const client = await prisma.client.findUnique({
        where: {
            id: clientId,
        },
        select: {
            id: true,
            name: true,
        },
    });

    if (!client) {
        return {
            client: null,
            branches: [],
            cities: [],
            provinces: [],
            businesses: [],
        };
    }

    const cities = await prisma.city.findManyUndeleted({
        select: {
            id: true,
            name: true,
            province: {
                select: {
                    name: true,
                    id: true,
                },
            },
        },
    });

    const provinces = await prisma.province.findManyUndeleted({
        select: {
            id: true,
            name: true,
        },
    });

    const businesses = await prisma.business.findManyUndeleted({
        select: {
            id: true,
            name: true,
        },
    });

    return {
        client,
        cities,
        provinces,
        businesses,
    };
};
