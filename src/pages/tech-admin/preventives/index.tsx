import { DashboardLayout } from '@/components/DashboardLayout';
import PreventiveTable from '@/components/Tables/PreventiveTable';
import TitleButton from '@/components/TitleButton';
import dbConnect from '@/lib/dbConnect';
import { mongooseDocumentToJSON } from '@/lib/utils';
import BusinessModel from 'backend/models/Business';
import CityModel from 'backend/models/City';
import ClientModel from 'backend/models/Client';
import {
    type IBusiness,
    type ICity,
    type IPreventive,
    type IProvince,
    type IUser,
    type IClient,
} from 'backend/models/interfaces';
import PreventiveModel from 'backend/models/Preventive';
import ProvinceModel from 'backend/models/Province';
import UserModel from 'backend/models/User';

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
    if (!props.preventives) {
        return (
            <DashboardLayout>
                <TitleButton
                    title="Preventivos"
                    path="/tech-admin/preventives/new"
                    nameButton="Agregar preventivo"
                />
                <h1>No hay preventivos</h1>;
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <TitleButton
                title="Preventivos"
                path="/tech-admin/preventives/new"
                nameButton="Agregar preventivo"
            />
            <PreventiveTable {...props} />
        </DashboardLayout>
    );
}

export async function getServerSideProps(): Promise<{
    props: IPreventiveProps;
}> {
    // res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=59')
    await dbConnect();
    try {
        const preventives = await PreventiveModel.findUndeleted({});
        if (preventives.length === 0) {
            return {
                props: {} as IPreventiveProps,
            };
        }
        const cities = await CityModel.findUndeleted({});
        const provinces = await ProvinceModel.findUndeleted({});
        const techs = await UserModel.findUndeleted({
            roles: 'Tecnico',
        });
        const businesses = await BusinessModel.findUndeleted();
        const clients = await ClientModel.findUndeleted();
        const props = mongooseDocumentToJSON({
            preventives,
            cities,
            provinces,
            techs,
            businesses,
            clients,
        });

        return {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            props: props as any,
        };
    } catch (error) {
        console.error(error);

        return {
            props: {} as IPreventiveProps,
        };
    }
}
