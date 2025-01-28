import { GetServerSideProps } from 'next';

import CreateOrUpdateBillingProfileForm from '@/components/Forms/Accounting/CreateOrUpdateBillingProfileForm';
import { prisma } from 'lib/prisma';

export type EditBillingProfilePageProps = Awaited<
    ReturnType<typeof getEditBillingProfilePageProps>
>;

const getEditBillingProfilePageProps = async (id: string) => {
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
    const mockProfile = {
        id,
        business: '1', // ID de la empresa existente
        cuit: '30123456789',
        contactName: 'Juan Pérez',
        contactEmail: 'juan.perez@empresaa.com',
        billingEmail: 'facturacion@empresaa.com',
    };

    return {
        businesses,
        defaultValues: mockProfile,
        profileIdToUpdate: id,
    };
};

export default function EditBillingProfile(
    props: EditBillingProfilePageProps,
): JSX.Element {
    return <CreateOrUpdateBillingProfileForm {...props} />;
}

export const getServerSideProps: GetServerSideProps<
    EditBillingProfilePageProps
> = async ({ params }) => {
    const id = params?.id as string;

    if (!id) {
        return {
            notFound: true,
        };
    }

    return {
        props: await getEditBillingProfilePageProps(id),
    };
};
