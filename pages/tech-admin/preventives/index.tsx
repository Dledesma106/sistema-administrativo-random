import { type GetServerSidePropsContext } from 'next'
import PreventiveTable from 'frontend/components/Tables/PreventiveTable'
import dbConnect from 'lib/dbConnect'
import { formatIds } from 'lib/utils'
import {
	type IBusiness,
	type ICity,
	type IPreventive,
	type IProvince,
	type IUser,
	type IClient
} from 'backend/models/interfaces'
import Preventive from 'backend/models/Preventive'
import TitleButton from 'frontend/components/TitleButton'
import City from 'backend/models/City'
import Province from 'backend/models/Province'
import User from 'backend/models/User'
import Business from 'backend/models/Business'
import Client from 'backend/models/Client'

interface IPreventiveProps {
	preventives: IPreventive[]
	cities: ICity[]
	provinces: IProvince[]
	techs: IUser[]
	businesses: IBusiness[]
	clients: IClient[]
}

export default function Preventives(props: IPreventiveProps): JSX.Element {
	// const tableProps = {cities, provinces, techs, businesses, clients}

	return (
		<>
			<TitleButton title="Preventivos" path="/tech-admin/preventives/new" nameButton="Agregar preventivo" />
			<PreventiveTable {...props} />
		</>
	)
}

export async function getServerSideProps({
	req,
	res
}: GetServerSidePropsContext): Promise<{ props: IPreventiveProps }> {
	// res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=59')
	await dbConnect()
	const preventives = await Preventive.findUndeleted({})
	if (preventives === null) return { props: {} as IPreventiveProps }
	const cities = await City.findUndeleted({})
	const provinces = await Province.findUndeleted({})
	const techs = await User.findUndeleted({ roles: 'Tecnico' })
	const businesses = await Business.findUndeleted()
	const clients = await Client.findUndeleted()
	const props = formatIds({ preventives, cities, provinces, techs, businesses, clients })

	return { props }
}
