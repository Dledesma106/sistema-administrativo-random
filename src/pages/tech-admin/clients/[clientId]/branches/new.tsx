import { GetServerSideProps } from 'next';

import { DashboardLayout } from '@/components/DashboardLayout';
import ClientBranchForm from '@/components/Forms/TechAdmin/ClientBranchForm';
import { prisma } from 'lib/prisma';

export type CreateClientBranchProps = Awaited<ReturnType<typeof getProps>>;

export default function NewClientBranch({
    cities,
    businesses,
    client,
}: CreateClientBranchProps): JSX.Element {
    if (!client) {
        return (
            <DashboardLayout>
                <div className="flex min-h-screen items-center justify-center">
                    <p className="text-2xl">No se encontró al cliente</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <ClientBranchForm
                client={{
                    id: client.id,
                    name: client.name,
                }}
                cities={cities}
                businesses={businesses}
            />
        </DashboardLayout>
    );
}

const getProps = async (clientId: string) => {
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

    const businesses = await prisma.business.findManyUndeleted({
        select: {
            id: true,
            name: true,
        },
    });

    const client = await prisma.client.findUnique({
        where: {
            id: clientId,
        },
        select: {
            id: true,
            name: true,
        },
    });

    return {
        cities,
        businesses,
        client,
    };
};

export const getServerSideProps: GetServerSideProps<
    CreateClientBranchProps,
    {
        clientId: string;
    }
> = async ({ params }) => {
    if (!params) {
        throw new Error('Missing params');
    }

    const props = await getProps(params.clientId);

    return {
        props: JSON.parse(JSON.stringify(props)),
    };
};
