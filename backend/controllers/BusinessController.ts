import { type NextApiResponse } from 'next';

import { NextConnectApiRequest } from './interfaces';

import dbConnect from '@/lib/dbConnect';
import { mongooseDocumentToJSON } from '@/lib/utils';
import BusinessModel from 'backend/models/Business';

const BusinessController = {
    putBusiness: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        const {
            body: { _id, name },
        } = req;

        await dbConnect();
        const businessForm = {
            name,
        };
        const newBusiness = await BusinessModel.findByIdAndUpdate(_id, businessForm, {
            new: true,
            runValidators: true,
        });
        if (newBusiness === null) {
            return res.json({
                statusCode: 500,
                error: 'could not update Business',
            });
        }
        const business = mongooseDocumentToJSON(newBusiness);
        res.status(200).json({
            data: {
                business,
                message: 'updated Business succesfully',
            },
        });
    },
    postBusiness: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        const {
            body: { name },
        } = req;
        await dbConnect();
        const businessForm = {
            name,
        };
        const deletedBusiness = await BusinessModel.findOne({
            name,
        });
        if (deletedBusiness !== null) {
            await deletedBusiness.restore();
            res.json({
                data: {
                    deletedBusiness,
                    message: 'created Business succesfully',
                },
            });
        }
        const newBusiness = await BusinessModel.create(businessForm);
        if (newBusiness === undefined) {
            return res.json({
                statusCode: 500,
                error: 'could not create Business',
            });
        }

        const business = mongooseDocumentToJSON(newBusiness);
        res.json({
            data: {
                business,
                message: 'created Business succesfully',
            },
        });
    },
    deleteBusiness: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        const { body: _id } = req;

        await dbConnect();
        const deletedBusiness = await BusinessModel.findById(_id);
        if (deletedBusiness === null) {
            return res.json({
                statusCode: 500,
                error: 'could not delete Business',
            });
        }
        // const Business = formatIds(newBusiness)
        await deletedBusiness.softDelete();
        res.json({
            data: {
                message: 'deleted Business succesfully',
            },
        });
    },
    getTech: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        await dbConnect();

        const { branchId } = req.query;
        const businesses = await BusinessModel.find({
            deleted: false,
            branch: branchId?.toString(),
        });

        return res.json({
            data: businesses,
        });
    },
};

export default BusinessController;
