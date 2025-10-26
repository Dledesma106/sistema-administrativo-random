import { useRouter } from 'next/router';

import CreateOrUpdateBudgetForm from '@/components/Forms/Accounting/CreateOrUpdateBudgetForm';
import { FormSkeleton } from '@/components/ui/skeleton';
import { useGetBudgetById } from '@/hooks/api/budget/useGetBudgetById';
import { useGetBusinesses } from '@/hooks/api/business/useGetBusinesses';

export default function EditBudget(): JSX.Element {
    const {
        query: { id },
    } = useRouter();
    const { data: businessesData, isLoading: isLoadingBusinesses } = useGetBusinesses({});
    const { data: budgetData, isLoading: isLoadingBudget } = useGetBudgetById({
        id: id as string,
    });

    if (isLoadingBusinesses || isLoadingBudget) {
        return <FormSkeleton />;
    }

    if (!budgetData?.budgetById) {
        return <div>Presupuesto no encontrado</div>;
    }

    const budget = budgetData.budgetById;

    const defaultValues = {
        business: budget.billingProfile.business.id,
        client: budget.client?.id,
        clientName: budget.clientName ?? '',
        branch: budget.branch?.id,
        subject: budget.subject,
        description: budget.description!,
        price: budget.price,
        expectedExpenses: budget.expectedExpenses,
        manpower: budget.manpower,
        markup: budget.markup ?? 0,
        budgetBranch: budget.budgetBranch ?? {
            name: '',
            number: null,
        },
        billingProfile: {
            business: budget.billingProfile.business.id,
            businessName: budget.billingProfile.business.name,
            numeroDocumento: budget.billingProfile.numeroDocumento,
            tipoDocumento: budget.billingProfile.tipoDocumento,
            legalName: budget.billingProfile.legalName,
            taxCondition: budget.billingProfile.IVACondition,
            billingAddress: budget.billingProfile.comercialAddress,
            billingEmails: budget.billingProfile.billingEmails,
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
            defaultValues={defaultValues}
        />
    );
}
