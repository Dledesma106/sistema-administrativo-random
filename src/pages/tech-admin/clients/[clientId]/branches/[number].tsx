import { GetServerSideProps } from 'next';

import { DashboardLayout } from '@/components/DashboardLayout';
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
            <DashboardLayout>
                <div className="flex min-h-screen items-center justify-center">
                    <p className="text-2xl">No se encontró la sucursal</p>
                </div>
            </DashboardLayout>
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
        <DashboardLayout>
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
        </DashboardLayout>
    );
}

const getProps = async (number: number) => {
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
    }
> = async ({ params }) => {
    const number = params?.number;
    if (!number) {
        throw new Error('Number is required');
    }

    const props = await getProps(parseInt(number, 10));

    return {
        props: JSON.parse(JSON.stringify(props)),
    };
};
