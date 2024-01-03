import { GetServerSideProps } from 'next';

import { Role } from '@prisma/client';

import { DashboardLayout } from '@/components/DashboardLayout';
import PreventiveForm from '@/components/Forms/TechAdmin/PreventiveForm';
import { type Frequency, type Month } from 'backend/models/types';
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
    if (propsAreValid(props)) {
        return null;
    }
    const { preventive, ...rest } = props;
    const preventiveForm: IPreventiveForm = {
        _id: preventive._id as string,
        branch: preventive.branch,
        business: preventive.business,
        assigned: preventive.assignedIDs,
        months: preventive.months as Month[],
        frequency: preventive.frequency as Frequency,
        status: preventive.status,
        lastDoneAt: preventive.lastDoneAt,
        batteryChangedAt: preventive.batteryChangedAt,
        observations: preventive.observations,
    };

    return (
        <DashboardLayout>
            <PreventiveForm
                newPreventive={false}
                preventiveForm={preventiveForm}
                {...rest}
            />
        </DashboardLayout>
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
    const branches = await prisma.branch.findMany({
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
    const clients = await prisma.client.findMany({
        where: {
            deleted: false,
        },
        select: {
            id: true,
            name: true,
        },
    });
    const technicians = await prisma.user.findMany({
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
    return prisma.preventive.findUniqueUndeleted({ where: { id } });
};
