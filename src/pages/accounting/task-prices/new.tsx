import { GetServerSideProps } from 'next';

import CreateOrUpdateTaskPriceForm from '@/components/Forms/Accounting/CreateOrUpdateTaskPriceForm';
import { prisma } from 'lib/prisma';

export type NewTaskPricePageProps = Awaited<ReturnType<typeof getNewTaskPricePageProps>>;

const getNewTaskPricePageProps = async () => {
    const businesses = await prisma.business.findManyUndeleted({
        where: {
            deleted: false,
        },
        select: {
            id: true,
            name: true,
        },
    });

    return {
        businesses,
    };
};

export default function NewTaskPrice(props: NewTaskPricePageProps): JSX.Element {
    return <CreateOrUpdateTaskPriceForm {...props} />;
}

export const getServerSideProps: GetServerSideProps<NewTaskPricePageProps> = async () => {
    return {
        props: await getNewTaskPricePageProps(),
    };
};
