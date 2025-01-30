import { useRouter } from 'next/router';

import ClientForm, { type IClientForm } from '@/components/Forms/TechAdmin/ClientForm';
import { FormSkeleton } from '@/components/ui/skeleton';
import { useGetClient } from '@/hooks/api/client/useGetClient';

export default function ClientEdit(): JSX.Element {
    const router = useRouter();
    const { id } = router.query;

    const { data: clientData, isLoading } = useGetClient({
        id: id as string,
    });

    if (isLoading) {
        return <FormSkeleton />;
    }
    if (!clientData?.client) {
        return <div>No se encontró el cliente</div>;
    }

    const clientForm: IClientForm = {
        id: clientData.client.id,
        name: clientData.client.name,
    };

    return <ClientForm newClient={false} clientForm={clientForm} />;
}
