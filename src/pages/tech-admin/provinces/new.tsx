import ProvinceForm, {
    type IProvinceForm,
} from '@/components/Forms/TechAdmin/ProvinceForm';

export default function NewProvince(): JSX.Element {
    const provinceForm: IProvinceForm = {
        _id: '',
        name: '',
    };

    return (
        <>
            <ProvinceForm provinceForm={provinceForm} />
        </>
    );
}
