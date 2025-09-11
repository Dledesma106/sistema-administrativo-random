import { useRouter } from 'next/router';

import CreateOrUpdateBudgetForm from '@/components/Forms/Accounting/CreateOrUpdateBudgetForm';
import { FormSkeleton } from '@/components/ui/skeleton';
import { useGetBranches } from '@/hooks/api/branch/useGetBranches';
import { useGetBudgetById } from '@/hooks/api/budget/useGetBudgetById';
import { useGetBusinesses } from '@/hooks/api/business/useGetBusinesses';
import { useGetClients } from '@/hooks/api/client/useGetClients';

export default function EditBudget(): JSX.Element {
    const {
        query: { id },
    } = useRouter();
    const { data: businessesData, isLoading: isLoadingBusinesses } = useGetBusinesses({});
    const { data: clientsData, isLoading: isLoadingClients } = useGetClients({});
    const { data: branchesData, isLoading: isLoadingBranches } = useGetBranches({});
    const { data: budgetData, isLoading: isLoadingBudget } = useGetBudgetById({
        id: id as string,
    });

    if (isLoadingBusinesses || isLoadingClients || isLoadingBranches || isLoadingBudget) {
        return <FormSkeleton />;
    }

    if (!budgetData?.budgetById) {
        return <div>Presupuesto no encontrado</div>;
    }

    const budget = budgetData.budgetById;

    const defaultValues = {
        business: budget.billingProfile.business.id,
        client: budget.client?.id,
        branch: budget.branch?.id,
        subject: budget.subject,
        description: budget.description!,
        price: budget.price,
        billingProfile: {
            business: budget.billingProfile.business.id,
            businessName: budget.billingProfile.business.name,
            cuit: budget.billingProfile.CUIT,
            legalName: budget.billingProfile.legalName,
            taxCondition: budget.billingProfile.IVACondition,
            billingAddress: budget.billingProfile.comercialAddress,
            billingEmail: budget.billingProfile.billingEmail,
            contacts: budget.billingProfile.contacts.map((contact) => ({
                name: contact.fullName,
                email: contact.email,
                phone: contact.phone,
                notes: contact.notes,
            })),
        },
    };

    return (
        <CreateOrUpdateBudgetForm
            budgetIdToUpdate={budgetData?.budgetById?.id as string}
            businesses={businessesData?.businesses || []}
            clients={clientsData?.clients || []}
            branches={branchesData?.branches || []}
            defaultValues={defaultValues}
        />
    );
}
