import { type NextApiResponse } from 'next';

import type mongoose from 'mongoose';

import { NextConnectApiRequest } from './interfaces';

import dbConnect from '@/lib/dbConnect';
import { formatIds } from '@/lib/utils';
import BranchModel from 'backend/models/Branch';
import { type Business } from 'backend/models/Business';

const BranchController = {
    putBranch: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        const {
            body: { _id, number, city, client, businesses },
        } = req;
        const businessesIds: mongoose.Types.ObjectId[] = businesses.map(
            (business: Business) => business._id,
        );
        await dbConnect();
        const branchForm = {
            number,
            city: city._id,
            client: client._id,
            businesses: businessesIds,
        };

        try {
            const newBranch = await BranchModel.findByIdAndUpdate(_id, branchForm, {
                new: true,
                runValidators: true,
            });
            if (newBranch == null) {
                res.json({ statusCode: 500, error: 'could not update branch' });
            }

            const branch = formatIds(newBranch);
            res.json({ data: { branch, message: 'updated branch succesfully' } });
        } catch (error) {
            return res.json({ statusCode: 500, error: 'could not update branch' });
        }
    },
    postBranch: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        const {
            body: { number, city, client, businesses },
        } = req;
        const businessesIds = businesses.map((business: Business) => business._id);
        await dbConnect();
        const branchForm = {
            number,
            city: city._id,
            client: client._id,
            businesses: businessesIds,
        };
        try {
            const deletedBranch = await BranchModel.findOne({
                number,
                client: client._id,
            });
            if (deletedBranch != null) {
                deletedBranch.city = city._id;
                deletedBranch.businesses = businessesIds;
                await deletedBranch.restore();
                return res.json({ data: { message: 'created branch succesfully' } });
            }
            const newBranch = await BranchModel.create(branchForm);
            if (newBranch === undefined) {
                return res.json({ statusCode: 500, error: 'could not create branch' });
            }
            return res.json({ data: { message: 'created branch succesfully' } });
        } catch (error) {
            return res.json({ statusCode: 500, error: 'could not create branch' });
        }
    },
    deleteBranch: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        const {
            body: { _id },
        } = req;
        await dbConnect();
        try {
            const deletedBranch = await BranchModel.findById(_id);

            if (deletedBranch == null) {
                return res.json({ statusCode: 500, error: 'could not delete Branch' });
            }
            await deletedBranch.softDelete();
            // const branch = formatIds(newBranch)
            res.json({ data: { message: 'deleted branch succesfully' } });
        } catch (error) {}
    },
    getTech: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        await dbConnect();

        const branches = await BranchModel.find({
            deleted: false,
        })
            .populate([
                {
                    path: 'city',
                    select: 'name',
                    populate: [
                        {
                            path: 'province',
                            select: 'name',
                        },
                    ],
                },
                {
                    path: 'client',
                    select: 'name',
                },
                {
                    path: 'businesses',
                    select: 'name',
                },
            ])
            .lean()
            .exec();

        if (!branches) {
            return res.status(500).json({ message: 'could not get branches' });
        }

        return res.status(200).json({ data: branches });
    },
};

export default BranchController;
