import { GetServerSidePropsContext } from 'next';

import { Role } from '@prisma/client';

import CreateOrUpdatePreventiveForm from '@/components/Forms/TechAdmin/CreateOrUpdatePreventiveForm';
import * as types from 'backend/models/types';
import { prisma } from 'lib/prisma';

type EditPreventivePageProps = Awaited<ReturnType<typeof getEditPreventivePageProps>>;

type EmptyProps = Record<string, never>;
type ValidProps = EditPreventivePageProps & {
    preventive: NonNullable<Awaited<ReturnType<typeof getPreventive>>>;
};

type Props = EmptyProps | ValidProps;

const getPreventive = async (id: string) => {
    const preventive = await prisma.preventive.findUniqueUndeleted({
        where: {
            id,
        },
        include: {
            branch: {
                select: {
                    clientId: true,
                },
            },
            assigned: {
                select: {
                    id: true,
                    fullName: true,
                },
                where: {
                    deleted: false,
                },
            },
        },
    });

    return preventive;
};

const propsAreValid = (props: Props): props is ValidProps => {
    return 'preventive' in props;
};

export default function EditPreventive(props: Props): JSX.Element {
    if (propsAreValid(props) === false) {
        return <>Preventive not found</>;
    }

    const { preventive, ...rest } = props;
    return (
        <>
            <CreateOrUpdatePreventiveForm
                {...rest}
                preventiveIdToUpdate={preventive.id}
                defaultValues={{
                    client: preventive.branch.clientId,
                    business: preventive.businessId,
                    branch: preventive.branchId,
                    lastDoneAt: preventive.lastDoneAt,
                    batteryChangedAt: preventive.batteryChangedAt,
                    assigned: preventive.assigned.map((assigned) => ({
                        label: assigned.fullName,
                        value: assigned.id,
                    })),
                    frequency: preventive.frequency,
                    observations: preventive.observations,
                    months: preventive.months.map((month) => ({
                        label: month,
                        value: month as types.Month,
                    })),
                    status: preventive.status,
                }}
            />
        </>
    );
}

export async function getServerSideProps(
    ctx: GetServerSidePropsContext,
): Promise<{ props: Props }> {
    const { params } = ctx;
    const id = params?.id;
    if (!id || Array.isArray(id)) {
        return {
            props: {},
        };
    }

    const preventive = await getPreventive(id);
    if (!preventive) {
        return {
            props: {},
        };
    }

    const rest = await getEditPreventivePageProps();

    return {
        props: {
            preventive: JSON.parse(JSON.stringify(preventive)),
            ...rest,
        },
    };
}

const getEditPreventivePageProps = async () => {
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
