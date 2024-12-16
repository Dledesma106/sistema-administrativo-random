import { GetServerSideProps } from 'next';

import { Role } from '@prisma/client';

import { useUserContext } from '@/context/userContext/UserProvider';
import ExpensesDataTable from '@/modules/tables/ExpensesDataTable';
import { prisma } from 'lib/prisma';

export type ExpensesPageProps = Awaited<ReturnType<typeof getProps>>;

const getProps = async () => {
    const techs = await prisma.user.findManyUndeleted({
        where: {
            roles: {
                has: Role.Tecnico,
            },
            deleted: false,
        },
        select: {
            id: true,
            fullName: true,
        },
    });

    return {
        techs: techs,
    };
};

export default function TechAdminTasks(props: ExpensesPageProps): JSX.Element {
    const { user } = useUserContext();
    return (
        <main>
            {user.roles?.includes('AdministrativoContable') ? (
                <>
                    <ExpensesDataTable {...props} />
                </>
            ) : (
                <div>No tienes permisos para ver esta página</div>
            )}
        </main>
    );
}

export const getServerSideProps: GetServerSideProps<ExpensesPageProps> = async () => {
    return {
        props: await getProps(),
    };
};
