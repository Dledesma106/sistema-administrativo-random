import { GetServerSideProps } from 'next';

import CreateOrUpdateBudgetForm from '@/components/Forms/Accounting/CreateOrUpdateBudgetForm';
import { prisma } from 'lib/prisma';

export type EditBudgetPageProps = Awaited<ReturnType<typeof getEditBudgetPageProps>>;

const getEditBudgetPageProps = async (id: string) => {
    const businesses = await prisma.business.findManyUndeleted({
        where: {
            deleted: false,
        },
        select: {
            id: true,
            name: true,
        },
    });

    const clients = await prisma.client.findManyUndeleted({
        where: {
            deleted: false,
        },
        select: {
            id: true,
            name: true,
        },
    });

    const branches = await prisma.branch.findManyUndeleted({
        where: {
            deleted: false,
        },
        select: {
            id: true,
            number: true,
            clientId: true,
            city: {
                select: {
                    name: true,
                },
            },
        },
    });

    // Mock data - Reemplazar con datos reales de tu API
    const mockBudget = {
        id,
        business: '1', // ID de la empresa existente
        client: '1', // ID del cliente existente
        branch: '1', // ID de la sucursal existente
        description: 'Descripción del presupuesto de ejemplo',
        price: 150000,
    };

    return {
        businesses,
        clients,
        branches: branches.map((branch) => ({
            ...branch,
            number: String(branch.number),
        })),
        defaultValues: mockBudget,
        budgetIdToUpdate: id,
    };
};

export default function EditBudget(props: EditBudgetPageProps): JSX.Element {
    return <CreateOrUpdateBudgetForm {...props} />;
}

export const getServerSideProps: GetServerSideProps<EditBudgetPageProps> = async ({
    params,
}) => {
    const id = params?.id as string;

    if (!id) {
        return {
            notFound: true,
        };
    }

    return {
        props: await getEditBudgetPageProps(id),
    };
};
