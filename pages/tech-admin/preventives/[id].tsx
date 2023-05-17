import Branch from 'backend/models/Branch'
import Business from 'backend/models/Business'
import Client from 'backend/models/Client'
import { type IBranch, type IBusiness, type IClient, type IUser, type IPreventive } from 'backend/models/interfaces'
import User from 'backend/models/User'
import dbConnect from 'lib/dbConnect'
import { formatIds } from 'lib/utils'
import { type GetServerSidePropsContext } from 'next'
import PreventiveForm, { type IPreventiveForm } from 'frontend/components/Forms/TechAdmin/PreventiveForm'
import { type Frequency, type Month } from 'backend/models/types'
import Preventive from 'backend/models/Preventive'

interface props {
    preventive: IPreventive
    branches: IBranch[]
    clients: IClient[]
    businesses: IBusiness[]
    technicians: IUser[]
}

export default function NewTask({ branches, clients, businesses, technicians, preventive }: props): JSX.Element {
    const preventiveFormProps = { branches, clients, businesses, technicians }

    const preventiveForm: IPreventiveForm = {
        _id: preventive._id as string,
        branch: preventive.branch,
        business: preventive.business,
        assigned: preventive.assigned,
        months: preventive.months as Month[],
        frequency: preventive.frequency as Frequency,
        status: preventive.status,
        lastDoneAt: preventive.lastDoneAt,
        batteryChangedAt: preventive.batteryChangedAt,
        observations: preventive.observations
    }

    return (
        <>
            <PreventiveForm newPreventive={false} preventiveForm={preventiveForm} {...preventiveFormProps} />
        </>
    )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext): Promise<{ props: props }> {
    const { params } = ctx
    if (params == null) return { props: {} as props }
    await dbConnect()
    const preventive = await Preventive.findById(params.id).populate(Preventive.getPopulateParameters())
    if (preventive == null) return { props: {} as props }
    console.log(preventive)

    const branches = await Branch.findUndeleted({})
    const clients = await Client.findUndeleted({})
    const businesses = await Business.findUndeleted({})
    const technicians = await User.findUndeleted({ roles: 'Tecnico' })

    return { props: formatIds({ branches, clients, businesses, technicians, preventive }) }
}
