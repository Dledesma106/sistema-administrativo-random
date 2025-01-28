import { GetServerSideProps } from 'next';

import CreateOrUpdateBudgetForm from '@/components/Forms/Accounting/CreateOrUpdateBudgetForm';
import { prisma } from 'lib/prisma';

export type NewBudgetPageProps = Awaited<ReturnType<typeof getNewBudgetPageProps>>;

const getNewBudgetPageProps = async () => {
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

    return {
        businesses,
        clients,
        branches: branches.map((branch) => ({
            ...branch,
            number: String(branch.number),
        })),
    };
};

export default function NewBudget(props: NewBudgetPageProps): JSX.Element {
    return <CreateOrUpdateBudgetForm {...props} />;
}

export const getServerSideProps: GetServerSideProps<NewBudgetPageProps> = async () => {
    return {
        props: await getNewBudgetPageProps(),
    };
};
