import ProvinceForm from '@/components/Forms/TechAdmin/ProvinceForm';

export default function NewProvince(): JSX.Element {
    const provinceForm = {
        id: '',
        name: '',
    };

    return (
        <>
            <ProvinceForm provinceForm={provinceForm} />
        </>
    );
}
