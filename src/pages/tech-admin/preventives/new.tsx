import { Role } from '@prisma/client';

import CreateOrUpdatePreventiveForm from '@/components/Forms/TechAdmin/CreateOrUpdatePreventiveForm';
import { prisma } from 'lib/prisma';

type Props = Awaited<ReturnType<typeof getNewPreventivePageProps>>;

export default function NewTask(props: Props): JSX.Element {
    return (
        <>
            <CreateOrUpdatePreventiveForm {...props} />
        </>
    );
}

export async function getServerSideProps(): Promise<{ props: Props }> {
    return {
        props: await getNewPreventivePageProps(),
    };
}

const getNewPreventivePageProps = async () => {
    const branches = await prisma.branch.findManyUndeleted({
        where: {
            deleted: false,
        },
        select: {
            id: true,
            number: true,
            clientId: true,
            businesses: {
                select: {
                    id: true,
                    name: true,
                },
            },
            city: {
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
            },
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
    const technicians = await prisma.user.findManyUndeleted({
        where: {
            deleted: false,
            roles: {
                has: Role.Tecnico,
            },
        },
        select: {
            id: true,
            fullName: true,
        },
    });

    return {
        branches,
        clients,
        technicians,
    };
};
