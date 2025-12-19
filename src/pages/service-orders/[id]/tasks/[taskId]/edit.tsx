import Head from 'next/head';
import { useRouter } from 'next/router';

import ServiceOrderTaskForm from '@/components/Forms/TechAdmin/CreateTaskFromServiceOrderForm';
import { FormSkeleton } from '@/components/ui/skeleton';
import { useGetServiceOrder } from '@/hooks/api/serviceOrders/useGetServiceOrder';
import { useGetTask } from '@/hooks/api/tasks/useGetTask';

const EditTaskFromServiceOrder = () => {
    const router = useRouter();
    const { id, taskId } = router.query;

    const {
        data: serviceOrderData,
        isPending: isServiceOrderPending,
        isError: isServiceOrderError,
    } = useGetServiceOrder(id as string);

    const {
        data: taskData,
        isPending: isTaskPending,
        isError: isTaskError,
    } = useGetTask(taskId as string);

    if (isServiceOrderPending || isTaskPending) {
        return <FormSkeleton />;
    }

    if (isServiceOrderError || isTaskError) {
        return <p>Error al cargar los datos</p>;
    }

    if (!serviceOrderData?.serviceOrder) {
        return <p>Orden de servicio no encontrada</p>;
    }

    if (!taskData?.taskById) {
        return <p>Tarea no encontrada</p>;
    }

    return (
        <>
            <Head>
                <title>
                    Editar Tarea #{taskData.taskById.taskNumber} | Sistema Administrativo
                </title>
            </Head>
            <ServiceOrderTaskForm
                serviceOrder={serviceOrderData.serviceOrder}
                task={taskData.taskById}
                mode="edit"
            />
        </>
    );
};

export default EditTaskFromServiceOrder;
