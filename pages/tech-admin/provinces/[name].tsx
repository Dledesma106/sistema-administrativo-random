import { type GetServerSidePropsContext } from 'next'
import ProvinceForm, { type IProvinceForm } from 'frontend/components/Forms/TechAdmin/ProvinceForm'
import dbConnect from 'lib/dbConnect'
import { deSlugify, formatIds } from 'lib/utils'
import { type IProvince } from 'backend/models/interfaces'
import Province from 'backend/models/Province'

interface props {
	province: IProvince
}

export default function ProvinceView({ province }: props): JSX.Element {
	const provinceForm: IProvinceForm = {
		_id: province._id as string,
		name: province.name
	}

	return (
		<>
			<ProvinceForm newProvince={false} provinceForm={provinceForm} />
		</>
	)
}

export async function getServerSideProps(ctx: GetServerSidePropsContext): Promise<{ props: props }> {
	const { params } = ctx
	await dbConnect()
	if (params == null) return { props: {} as props }
	const docProvince = await Province.findOne({ name: deSlugify(params.name as string) })
	const province = formatIds(docProvince)
	return { props: { province } }
}
