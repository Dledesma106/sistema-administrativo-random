import { type NextApiResponse } from 'next';

import { NextConnectApiRequest } from './interfaces';

import dbConnect from '@/lib/dbConnect';
import { mongooseDocumentToJSON } from '@/lib/utils';

import ProvinceModel from '../models/Province';

const ProvinceController = {
    putProvince: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        const {
            body: { _id, name },
        } = req;

        await dbConnect();
        const provinceForm = {
            name,
        };
        const newProvince = await ProvinceModel.findByIdAndUpdate(_id, provinceForm, {
            new: true,
            runValidators: true,
        });
        if (newProvince === null) {
            return res.json({
                statusCode: 500,
                error: 'could not update province',
            });
        }
        const province = mongooseDocumentToJSON(newProvince);
        return res.json({
            data: {
                province,
                message: 'updated province succesfully',
            },
        });
    },
    postProvince: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        const {
            body: { name },
        } = req;
        await dbConnect();
        const provinceForm = {
            name,
        };
        const deletedProvince = await ProvinceModel.findOne({
            name,
        });
        if (deletedProvince) {
            await deletedProvince.restore();
            return res.json({
                data: {
                    deletedProvince,
                    message: 'created province succesfully',
                },
            });
        }
        const newProvince = await ProvinceModel.create(provinceForm);
        if (newProvince === undefined) {
            return res.json({
                statusCode: 500,
                error: 'could not create province',
            });
        }

        const province = mongooseDocumentToJSON(newProvince);
        return res.json({
            data: {
                province,
                message: 'created province succesfully',
            },
        });
    },
    deleteProvince: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        const {
            body: { _id },
        } = req;

        await dbConnect();
        const deletedProvince = await ProvinceModel.findById(_id);
        if (deletedProvince === null) {
            return res.json({
                statusCode: 500,
                error: 'could not delete province',
            });
        }
        await deletedProvince.softDelete();
        return res.json({
            data: {
                message: 'deleted province succesfully',
            },
        });
    },
};

export default ProvinceController;
