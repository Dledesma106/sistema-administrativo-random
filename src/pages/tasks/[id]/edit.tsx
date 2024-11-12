import { GetServerSideProps } from 'next';

import { Role } from '@prisma/client';

import { DashboardLayout } from '@/components/DashboardLayout';
import CreateOrUpdateTaskForm from '@/components/Forms/TechAdmin/CreateOrUpdateTaskForm';
import { prisma } from 'lib/prisma';

import { NewTaskPageProps } from '../new';

type EmptyProps = Record<string, never>;
type ValidProps = NewTaskPageProps & {
    task: NonNullable<Awaited<ReturnType<typeof getTask>>>;
};

type Props = EmptyProps | ValidProps;

type Params = {
    id: string;
};

const getTask = async (id: string) => {
    const task = await prisma.task.findUniqueUndeleted({
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

    return task;
};

const propsAreValid = (props: Props): props is ValidProps => {
    return 'task' in props;
};

export default function TaskView(props: Props): JSX.Element {
    if (propsAreValid(props) === false) {
        return <DashboardLayout>Task not found</DashboardLayout>;
    }

    const { task, ...rest } = props;

    return (
        <DashboardLayout>
            <CreateOrUpdateTaskForm
                defaultValues={{
                    assignedIDs: task.assigned.map((user) => {
                        return {
                            label: user.fullName,
                            value: user.id,
                        };
                    }),
                    branch: task.branchId,
                    business: task.businessId,
                    client: task.branch.clientId,
                    description: task.description,
                    status: task.status,
                    taskType: task.taskType,
                    workOrderNumber: task.workOrderNumber,
                    movitecTicket: task.movitecTicket ?? '',
                }}
                taskIdToUpdate={task.id}
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

    const task = await getTask(id);
    if (!task) {
        return {
            props: {},
        };
    }

    const rest = await getNewTaskPageProps();

    return {
        props: {
            task: JSON.parse(JSON.stringify(task)),
            ...rest,
        },
    };
};

const getNewTaskPageProps = async () => {
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
