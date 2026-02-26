import { useRouter } from 'next/router';

import { BillConcepto, AlicuotaIVA } from '@prisma/client';

import { FormSkeleton } from '@/components/ui/skeleton';
import { useGetBillById } from '@/hooks/api/bill';
import { useGetBillingProfiles } from '@/hooks/api/billingProfile';
import { CreateBillingForm } from '@/modules/Forms/Accounting/CreateBillingForm';
import {
    calculateDetailIva,
    PaymentCondition,
} from '@/modules/Forms/Accounting/CreateBillingForm/types';

export default function EditBillingPage(): JSX.Element {
    const router = useRouter();
    const id = router.query.id as string;

    const { data: billData, isLoading: isLoadingBill } = useGetBillById(id);
    const { data: billingProfilesData, isLoading: isLoadingProfiles } =
        useGetBillingProfiles({});

    if (isLoadingBill || isLoadingProfiles) {
        return <FormSkeleton />;
    }

    if (!billData?.bill) {
        return <div>Factura no encontrada</div>;
    }

    const bill = billData.bill;

    const initialValues = {
        billingProfileId: bill.billingProfile?.id,
        legalName: bill.billingProfile.legalName,
        cuit: bill.billingProfile.numeroDocumento,
        businessAddress: bill.billingProfile.comercialAddress,
        ivaCondition: bill.billingProfile.IVACondition,
        comprobanteType: bill.comprobanteType,
        paymentCondition: bill.saleCondition as PaymentCondition,
        pointOfSale: bill.pointOfSale,
        dateFrom: bill.punctualService
            ? bill.serviceDate
                ? new Date(bill.serviceDate)
                : new Date()
            : bill.startDate
              ? new Date(bill.startDate)
              : new Date(),
        dateTo: bill.endDate ? new Date(bill.endDate) : undefined,
        isSingleService: bill.punctualService,
        dueDate: bill.dueDate ? new Date(bill.dueDate) : new Date(),
        concepto: bill.concepto as BillConcepto,
        details: (bill.details || []).map((d) => {
            const computed = calculateDetailIva(
                d.quantity,
                d.unitPrice,
                d.alicuotaIVA as AlicuotaIVA,
            );
            return {
                id: d.id,
                description: d.description,
                quantity: d.quantity,
                unitPrice: d.unitPrice,
                alicuotaIVA: d.alicuotaIVA,
                subtotal: computed.subtotal,
                ivaAmount: computed.ivaAmount,
                subtotalWithIva: computed.subtotalWithIva,
                taskId: d.task?.id ?? null,
                task: d.task ?? null,
            };
        }),
        directTasks: (bill.tasks || []).map((t) => ({
            id: t.id,
            taskNumber: t.taskNumber,
            description: t.description,
            status: t.status,
            closedAt: t.closedAt ? new Date(t.closedAt) : null,
            businessName: t.business?.name ?? null,
            clientName: t.branch?.client?.name ?? null,
            customBranch: t.customBranch || null,
            branch: t.branch
                ? {
                      id: t.branch.id,
                      name: t.branch.name,
                      number: t.branch.number,
                      client: t.branch.client
                          ? {
                                id: t.branch.client.id,
                                name: t.branch.client.name,
                            }
                          : null,
                  }
                : null,
        })),
        observations: bill.observations || undefined,
        withholdingAmount: bill.withholdingAmount ?? undefined,
        status: bill.status,
        serviceOrderId: bill.serviceOrder?.id ?? null,
    };

    return (
        <CreateBillingForm
            billingProfiles={billingProfilesData?.billingProfiles || []}
            businessId={bill.business?.id}
            initialValues={initialValues}
            billId={id}
        />
    );
}
