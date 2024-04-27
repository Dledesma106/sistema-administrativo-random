import { DashboardLayout } from '@/components/DashboardLayout';
import dbConnect from '@/lib/dbConnect';
import CreateOrUpdateUserForm, { UserFormProps } from '@/modules/CreateOrUpdateUserForm';
import { prisma } from 'lib/prisma';

interface NewUserPageProps {
    cities: UserFormProps['cities'];
}

export default function NewUser({ cities }: NewUserPageProps): JSX.Element {
    return (
        <DashboardLayout>
            <CreateOrUpdateUserForm cities={cities} />
        </DashboardLayout>
    );
}

export async function getServerSideProps(): Promise<{ props: NewUserPageProps }> {
    await dbConnect();

    const cities = await prisma.city.findManyUndeleted({
        where: {
            deleted: false,
        },
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
    });

    return {
        props: {
            cities: cities.map((city) => ({
                _id: city.id,
                name: city.name,
                provinceId: {
                    id: city.province.id,
                    name: city.province.name,
                },
            })),
        },
    };
}
