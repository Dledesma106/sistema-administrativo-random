import { type NextApiResponse } from 'next';

import { NextConnectApiRequest } from './interfaces';

import dbConnect from '@/lib/dbConnect';
import { formatIds } from '@/lib/utils';

import Province from '../models/Province';

const ProvinceController = {
    putProvince: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        const {
            body: { _id, name },
        } = req;

        await dbConnect();
        const provinceForm = { name };
        const newProvince = await Province.findByIdAndUpdate(_id, provinceForm, {
            new: true,
            runValidators: true,
        });
        if (newProvince == null) {
            return res.json({ statusCode: 500, error: 'could not update province' });
        }
        const province = formatIds(newProvince);
        res.json({ data: { province, message: 'updated province succesfully' } });
    },
    postProvince: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        const {
            body: { name },
        } = req;
        await dbConnect();
        const provinceForm = { name };
        const deletedProvince = await Province.findOne({ name });
        if (deletedProvince != null) {
            await deletedProvince.restore();
            return res.json({
                data: { deletedProvince, message: 'created province succesfully' },
            });
        }
        const newProvince = await Province.create(provinceForm);
        if (newProvince === undefined) {
            return res.json({ statusCode: 500, error: 'could not create province' });
        }

        const province = formatIds(newProvince);
        res.json({ data: { province, message: 'created province succesfully' } });
    },
    deleteProvince: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        const {
            body: { _id },
        } = req;

        await dbConnect();
        const deletedProvince = await Province.findById(_id);
        if (deletedProvince == null) {
            return res.json({ statusCode: 500, error: 'could not delete province' });
        }
        await deletedProvince.softDelete();
        res.json({ data: { message: 'deleted province succesfully' } });
    },
};

export default ProvinceController;
