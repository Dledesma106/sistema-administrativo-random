import { type GetServerSidePropsContext } from 'next'
import dbConnect from 'lib/dbConnect'
import { deSlugify, formatIds } from 'lib/utils'
import { type ICity, type IProvince } from 'backend/models/interfaces'
import Province from 'backend/models/Province'
import City from 'backend/models/City'
import CityForm, { type ICityForm } from 'frontend/components/Forms/TechAdmin/CityForm'

interface props {
	city: ICity
	provinces: IProvince[]
}

export default function CityView({ city, provinces }: props): JSX.Element {
	const cityForm: ICityForm = {
		_id: city._id as string,
		name: city.name,
		province: city.province as IProvince
	}

	return (
		<>
			<CityForm newCity={false} cityForm={cityForm} provinces={provinces} />
		</>
	)
}

export async function getServerSideProps(ctx: GetServerSidePropsContext): Promise<{ props: props }> {
	// ctx.res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=59')
	const { params } = ctx
	await dbConnect()
	if (params == null) return { props: {} as props }
	const docCity = await City.findOneUndeleted({ name: deSlugify(params.name as string) })
	const docProvinces = await Province.findUndeleted({})
	const city = formatIds(docCity)
	// console.log(docCity)
	const provinces = formatIds(docProvinces)
	return { props: { city, provinces } }
}
