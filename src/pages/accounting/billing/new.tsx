import { CreateBillingForm } from '@/modules/Forms/Accounting/CreateBillingForm';

const mockBillingProfiles = [
    {
        id: '1',
        businessName: 'Empresa A S.A.',
        legalName: 'Empresa A S.A.',
        cuit: '30-12345678-9',
        businessAddress: 'Av. Siempreviva 742, Springfield',
        ivaCondition: 'ResponsableInscripto',
        contactName: 'Juan Perez',
        contactEmail: 'juan.perez@empresa.com',
        billingEmail: 'facturacion@empresa.com',
    },
    {
        id: '2',
        businessName: 'Empresa B S.R.L.',
        legalName: 'Empresa B S.R.L.',
        cuit: '30-98765432-1',
        businessAddress: 'Calle Falsa 123, Buenos Aires',
        ivaCondition: 'Monotributista',
        contactName: 'Ana Garcia',
        contactEmail: 'ana.garcia@empresa.com',
        billingEmail: 'facturacion@empresa.com',
    },
    {
        id: '3',
        businessName: 'Empresa C S.A.',
        legalName: 'Empresa C S.A.',
        cuit: '30-45678901-2',
        businessAddress: 'Av. Corrientes 1234, CABA',
        ivaCondition: 'ResponsableInscripto',
        contactName: 'Pedro Rodriguez',
        contactEmail: 'pedro.rodriguez@empresa.com',
        billingEmail: 'facturacion@empresa.com',
    },
];

export default function CreateBillingPage() {
    return <CreateBillingForm billingProfiles={mockBillingProfiles} />;
}
