import { GetServerSideProps } from 'next';

import { useRouter } from 'next/router';

import { Role } from '@prisma/client';

import CreateOrUpdatePreventiveForm from '@/components/Forms/TechAdmin/CreateOrUpdatePreventiveForm';
import { Month, type Frequency } from 'backend/models/types';
import { prisma } from 'lib/prisma';

export type EditPreventivePageProps = Awaited<
    ReturnType<typeof getEditPreventivePageProps>
>;

type ValidProps = EditPreventivePageProps & {
    preventive: NonNullable<Awaited<ReturnType<typeof getPreventive>>>;
};

type Props = ValidProps | Record<string, never>;

const propsAreValid = (props: Props): props is ValidProps => {
    return 'preventive' in props;
};

type Params = {
    id: string;
};

export default function EditPreventive(props: Props) {
    const router = useRouter();

    if (!propsAreValid(props)) {
        return null;
    }
    const { preventive, ...rest } = props;

    return (
        <>
            <CreateOrUpdatePreventiveForm
                defaultValues={{
                    client: preventive.branch.clientId,
                    branch: preventive.branch.id,
                    business: preventive.businessId,
                    assigned: preventive.assigned.map((user) => ({
                        label: user.fullName,
                        value: user.id,
                    })),
                    frequency: preventive.frequency as Frequency,
                    months: preventive.months.map((month) => ({
                        label: month,
                        value: month as Month,
                    })),
                    observations: preventive.observations,
                    status: preventive.status,
                }}
                preventiveIdToUpdate={router.query.id as string}
                {...rest}
            />
        </>
    );
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async (ctx) => {
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
};

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

const getPreventive = async (id: string) => {
    return await prisma.preventive.findUniqueUndeleted({
        where: {
            id,
            deleted: false,
        },
        select: {
            id: true,
            frequency: true,
            status: true,
            months: true,
            businessId: true,
            branch: {
                select: {
                    id: true,
                    clientId: true,
                },
            },
            assigned: {
                select: {
                    id: true,
                    fullName: true,
                },
            },
            observations: true,
        },
    });
};
