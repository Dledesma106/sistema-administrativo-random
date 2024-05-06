import { type GetServerSidePropsContext } from 'next';

import { DashboardLayout } from '@/components/DashboardLayout';
import TitleButton from '@/components/TitleButton';
import ClientBranchesTable from '@/modules/tables/ClientBranchesTable';
import { prisma } from 'lib/prisma';

type ClientViewProps = Awaited<ReturnType<typeof getProps>>;

export type ValidClientViewProps = {
    client: {
        id: string;
        name: string;
    };
    branches: {
        id: string;
        number: number;
        city: {
            id: string;
            name: string;
            province: {
                id: string;
                name: string;
            };
        };
        businesses: {
            id: string;
            name: string;
        }[];
        client: {
            id: string;
            name: string;
        };
    }[];
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
    branches,
    cities,
    provinces,
    businesses,
}: ClientViewProps): JSX.Element {
    if (!client) {
        return (
            <DashboardLayout>
                <div className="flex min-h-screen items-center justify-center">
                    <p className="text-2xl">No se encontró al cliente</p>
                </div>
            </DashboardLayout>
        );
    }

    const name = `Cliente: ${client.name}`;
    return (
        <DashboardLayout>
            <main>
                <TitleButton
                    title={name}
                    path={`/tech-admin/clients/${client.id}/branches/new`}
                    nameButton="Agregar sucursal"
                />

                <ClientBranchesTable
                    client={client}
                    branches={branches}
                    cities={cities}
                    provinces={provinces}
                    businesses={businesses}
                />
            </main>
        </DashboardLayout>
    );
}

export async function getServerSideProps(
    ctx: GetServerSidePropsContext,
): Promise<{ props: ClientViewProps }> {
    const { params } = ctx;
    if (!params) {
        return {
            props: {} as ClientViewProps,
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

    const branches = await prisma.branch.findMany({
        where: {
            clientId: client.id,
            deleted: false,
        },
        include: {
            city: {
                select: {
                    id: true,
                    name: true,
                    province: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
            businesses: {
                select: {
                    id: true,
                    name: true,
                },
            },
            client: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });

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
        branches,
        cities,
        provinces,
        businesses,
    };
};
