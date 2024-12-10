import { GetServerSideProps } from 'next';

import {  } from '@/components/';
import ClientBranchForm, {
    type BranchFormValues,
} from '@/components/Forms/TechAdmin/ClientBranchForm';
import { prisma } from 'lib/prisma';

export type EditClientBranchProps = Awaited<ReturnType<typeof getProps>>;

export default function EditClientBranch({
    branch,
    cities,
    businesses,
}: EditClientBranchProps): JSX.Element {
    if (!branch) {
        return (
            <>
                <div className="flex min-h-screen items-center justify-center">
                    <p className="text-2xl">No se encontró la sucursal</p>
                </div>
            </>
        );
    }

    const branchForm: BranchFormValues = {
        businesses: branch.businesses.map((business) => {
            return {
                value: business.id,
                label: business.name,
            };
        }),
        cityId: branch.city.id,
        number: branch.number,
    };

    return (
        <>
            <ClientBranchForm
                businesses={businesses}
                cities={cities}
                client={{
                    id: branch.client.id,
                    name: branch.client.name,
                }}
                branchForm={branchForm}
                idToUpdate={branch.id}
            />
        </>
    );
}

const getProps = async (number: number, clientId: string) => {
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

    const branch = await prisma.branch.findFirst({
        where: {
            deleted: false,
            clientId,
            number: number,
        },
        include: {
            client: true,
            city: true,
            businesses: true,
        },
    });

    const businesses = await prisma.business.findManyUndeleted({
        select: {
            id: true,
            name: true,
        },
    });

    return {
        branch,
        cities,
        businesses,
    };
};

export const getServerSideProps: GetServerSideProps<
    EditClientBranchProps,
    {
        number: string;
        clientId: string;
    }
> = async (context) => {
    const { clientId, number } = context.params as { clientId: string; number: string };
    if (!number) {
        throw new Error('Number is required');
    }
    const props = await getProps(parseInt(number, 10), clientId ?? '');

    return {
        props: JSON.parse(JSON.stringify(props)),
    };
};
