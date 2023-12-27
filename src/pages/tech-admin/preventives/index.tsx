import PreventiveTable from '@/components/Tables/PreventiveTable';
import TitleButton from '@/components/TitleButton';
import dbConnect from '@/lib/dbConnect';
import { mongooseDocumentToJSON } from '@/lib/utils';
import Business from 'backend/models/Business';
import City from 'backend/models/City';
import Client from 'backend/models/Client';
import {
    type IBusiness,
    type ICity,
    type IPreventive,
    type IProvince,
    type IUser,
    type IClient,
} from 'backend/models/interfaces';
import Preventive from 'backend/models/Preventive';
import Province from 'backend/models/Province';
import User from 'backend/models/User';

interface IPreventiveProps {
    preventives: IPreventive[];
    cities: ICity[];
    provinces: IProvince[];
    techs: IUser[];
    businesses: IBusiness[];
    clients: IClient[];
}

export default function Preventives(props: IPreventiveProps): JSX.Element {
    // const tableProps = {cities, provinces, techs, businesses, clients}

    return (
        <>
            <TitleButton
                title="Preventivos"
                path="/tech-admin/preventives/new"
                nameButton="Agregar preventivo"
            />
            <PreventiveTable {...props} />
        </>
    );
}

export async function getServerSideProps(): Promise<{
    props: IPreventiveProps;
}> {
    // res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=59')
    await dbConnect();
    const preventives = await Preventive.findUndeleted({});
    if (preventives === null) {
        return {
            props: {} as IPreventiveProps,
        };
    }
    const cities = await City.findUndeleted({});
    const provinces = await Province.findUndeleted({});
    const techs = await User.findUndeleted({
        roles: 'Tecnico',
    });
    const businesses = await Business.findUndeleted();
    const clients = await Client.findUndeleted();
    const props = mongooseDocumentToJSON({
        preventives,
        cities,
        provinces,
        techs,
        businesses,
        clients,
    });

    return {
        props,
    };
}
