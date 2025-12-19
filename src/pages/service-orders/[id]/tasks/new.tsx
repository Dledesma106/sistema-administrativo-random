import Head from 'next/head';
import { useRouter } from 'next/router';

import CreateTaskFromServiceOrderForm from '@/components/Forms/TechAdmin/CreateTaskFromServiceOrderForm';
import { FormSkeleton } from '@/components/ui/skeleton';
import { useGetServiceOrder } from '@/hooks/api/serviceOrders/useGetServiceOrder';

const NewTaskFromServiceOrder = () => {
    const router = useRouter();
    const { id } = router.query;

    const { data, isPending, isError } = useGetServiceOrder(id as string);

    if (isPending) {
        return <FormSkeleton />;
    }

    if (isError) {
        return <p>Error al cargar la orden de servicio</p>;
    }

    if (!data?.serviceOrder) {
        return <p>Orden de servicio no encontrada</p>;
    }

    return (
        <>
            <Head>
                <title>Nueva Tarea | Sistema Administrativo</title>
            </Head>
            <CreateTaskFromServiceOrderForm serviceOrder={data.serviceOrder} />
        </>
    );
};

export default NewTaskFromServiceOrder;
