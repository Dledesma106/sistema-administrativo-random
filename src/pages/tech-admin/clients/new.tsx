import { DashboardLayout } from '@/components/DashboardLayout';
import ClientForm, { type IClientForm } from '@/components/Forms/TechAdmin/ClientForm';

export default function NewClient(): JSX.Element {
    const clientForm: IClientForm = {
        _id: '',
        name: '',
    };

    return (
        <DashboardLayout>
            <ClientForm clientForm={clientForm} />
        </DashboardLayout>
    );
}
