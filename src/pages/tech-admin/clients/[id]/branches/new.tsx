import { useRouter } from 'next/router';

import ClientBranchForm from '@/components/Forms/TechAdmin/ClientBranchForm';
import { FormSkeleton } from '@/components/ui/skeleton';
import { useGetBusinesses } from '@/hooks/api/business/useGetBusinesses';
import { useGetCities } from '@/hooks/api/city/useGetCities';
import { useGetClient } from '@/hooks/api/client/useGetClient';

export default function NewClientBranch(): JSX.Element {
    const router = useRouter();
    const clientId = router.query.id as string;

    const { data: citiesData, isLoading: isLoadingCities } = useGetCities({});
    const { data: businessesData, isLoading: isLoadingBusinesses } = useGetBusinesses({});
    const { data: clientData, isLoading: isLoadingClient } = useGetClient({
        id: clientId,
    });

    if (isLoadingCities || isLoadingBusinesses || isLoadingClient) {
        return <FormSkeleton />;
    }

    if (!clientData?.client) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-2xl">No se encontró al cliente</p>
            </div>
        );
    }

    return (
        <ClientBranchForm
            client={{
                id: clientData.client.id,
                name: clientData.client.name,
            }}
            cities={citiesData?.cities || []}
            businesses={businessesData?.businesses || []}
        />
    );
}
