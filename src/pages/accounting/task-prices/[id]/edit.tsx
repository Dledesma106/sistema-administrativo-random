import { GetServerSideProps } from 'next';

import { TaskType } from '@prisma/client';

import CreateOrUpdateTaskPriceForm from '@/components/Forms/Accounting/CreateOrUpdateTaskPriceForm';
import { prisma } from 'lib/prisma';

export type EditTaskPricePageProps = Awaited<
    ReturnType<typeof getEditTaskPricePageProps>
>;

const getEditTaskPricePageProps = async (id: string) => {
    const businesses = await prisma.business.findManyUndeleted({
        where: {
            deleted: false,
        },
        select: {
            id: true,
            name: true,
        },
    });

    // Mock data - Reemplazar con datos reales de tu API
    const mockPrice = {
        id,
        business: '1', // ID de la empresa existente
        taskType: TaskType.Preventivo,
        price: 150000,
    };

    return {
        businesses,
        defaultValues: mockPrice,
        priceIdToUpdate: id,
    };
};

export default function EditTaskPrice(props: EditTaskPricePageProps): JSX.Element {
    return <CreateOrUpdateTaskPriceForm {...props} />;
}

export const getServerSideProps: GetServerSideProps<EditTaskPricePageProps> = async ({
    params,
}) => {
    const id = params?.id as string;

    if (!id) {
        return {
            notFound: true,
        };
    }

    return {
        props: await getEditTaskPricePageProps(id),
    };
};
