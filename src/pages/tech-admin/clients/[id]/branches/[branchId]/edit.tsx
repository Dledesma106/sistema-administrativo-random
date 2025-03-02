import { useRouter } from 'next/router';

import ClientBranchForm, {
    type BranchFormValues,
} from '@/components/Forms/TechAdmin/ClientBranchForm';
import { FormSkeleton } from '@/components/ui/skeleton';
import { useGetBranch } from '@/hooks/api/branch/useGetBranch';
import { useGetBusinesses } from '@/hooks/api/business/useGetBusinesses';
import { useGetCities } from '@/hooks/api/city/useGetCities';

export default function EditClientBranch(): JSX.Element {
    const router = useRouter();
    const { branchId } = router.query;

    const { data: branchData, isLoading: isLoadingBranch } = useGetBranch(
        branchId as string,
    );
    const { data: citiesData, isLoading: isLoadingCities } = useGetCities({});
    const { data: businessesData, isLoading: isLoadingBusinesses } = useGetBusinesses({});

    if (isLoadingBranch || isLoadingCities || isLoadingBusinesses) {
        return <FormSkeleton />;
    }

    const branch = branchData?.branch;

    if (!branch) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-2xl">No se encontró la sucursal</p>
            </div>
        );
    }

    const branchForm: BranchFormValues = {
        businesses: branch.businesses.map((business) => ({
            value: business.id,
            label: business.name,
        })),
        cityId: branch.city.id,
        number: branch.number,
    };

    return (
        <ClientBranchForm
            businesses={businessesData?.businesses || []}
            cities={citiesData?.cities || []}
            client={{
                id: branch.client.id,
                name: branch.client.name,
            }}
            branchForm={branchForm}
            idToUpdate={branch.id}
        />
    );
}
