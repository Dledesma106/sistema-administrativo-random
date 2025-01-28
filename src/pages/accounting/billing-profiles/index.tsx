import BillingProfilesDataTable from '@/modules/tables/BillingProfilesTable';

const mockData = [
    {
        id: '1',
        businessName: 'Empresa A S.A.',
        cuit: '30-12345678-9',
        contactName: 'Juan Pérez',
        contactEmail: 'juan.perez@empresaa.com',
        billingEmail: 'facturacion@empresaa.com',
    },
    {
        id: '2',
        businessName: 'Constructora B S.R.L.',
        cuit: '30-98765432-1',
        contactName: 'María González',
        contactEmail: 'maria.gonzalez@constructorab.com',
        billingEmail: 'administracion@constructorab.com',
    },
    {
        id: '3',
        businessName: 'Servicios C S.A.',
        cuit: '30-45678901-2',
        contactName: 'Carlos Rodríguez',
        contactEmail: 'carlos.rodriguez@serviciosc.com',
        billingEmail: 'facturacion@serviciosc.com',
    },
];

export default function BillingProfilesPage() {
    return <BillingProfilesDataTable data={mockData} />;
}
