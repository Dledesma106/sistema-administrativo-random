import { DashboardLayout } from '@/components/DashboardLayout';
import BusinessForm, {
    type IBusinessForm,
} from '@/components/Forms/TechAdmin/BusinessForm';

export default function NewBusiness(): JSX.Element {
    const businessForm: IBusinessForm = {
        _id: '',
        name: '',
    };

    return (
        <DashboardLayout>
            <BusinessForm newBusiness={true} businessForm={businessForm} />
        </DashboardLayout>
    );
}
