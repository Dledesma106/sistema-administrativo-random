import { GetServerSideProps } from 'next';

import CreateOrUpdateBillingProfileForm from '@/components/Forms/Accounting/CreateOrUpdateBillingProfileForm';
import { prisma } from 'lib/prisma';

export type NewBillingProfilePageProps = Awaited<
    ReturnType<typeof getNewBillingProfilePageProps>
>;

const getNewBillingProfilePageProps = async () => {
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

export default function NewBillingProfile(
    props: NewBillingProfilePageProps,
): JSX.Element {
    return <CreateOrUpdateBillingProfileForm {...props} />;
}

export const getServerSideProps: GetServerSideProps<
    NewBillingProfilePageProps
> = async () => {
    return {
        props: await getNewBillingProfilePageProps(),
    };
};
