import { type NextApiResponse } from 'next';

import { NextConnectApiRequest } from './interfaces';

import dbConnect from '@/lib/dbConnect';
import { formatIds } from '@/lib/utils';
import { type User } from 'backend/models/User';

import Preventive from '../models/Preventive';

const PreventiveController = {
    putPreventive: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        const { body } = req;
        await dbConnect();
        const {
            _id,
            branch,
            business,
            assigned,
            status,
            frequency,
            months,
            lastDoneAt,
            batteryChangedAt,
            observations,
        } = body;
        const assignedIds = assigned.map((user: User) => user._id);
        const preventiveForm = {
            _id,
            branch,
            business,
            assigned: assignedIds,
            status,
            frequency,
            months,
            lastDoneAt,
            batteryChangedAt,
            observations,
        };
        try {
            const newPreventive = await Preventive.findByIdAndUpdate(
                _id,
                preventiveForm,
                {
                    new: true,
                    runValidators: true,
                },
            );
            if (newPreventive == null) {
                res.json({ statusCode: 500, error: 'could not update Preventive' });
            }

            res.json({
                statusCode: 200,
                data: {
                    Preventive: formatIds(newPreventive),
                    message: 'updated Preventive succesfully',
                },
            });
        } catch (error) {
            return res.json({ statusCode: 500, error: 'could not update Preventive' });
        }
    },
    postPreventive: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        const { body } = req;
        await dbConnect();
        const {
            branch,
            business,
            assigned,
            status,
            frequency,
            months,
            lastDoneAt,
            batteryChangedAt,
            observations,
        } = body;
        const assignedIds = assigned.map((user: User) => user._id);
        const preventiveForm = {
            branch,
            business,
            assigned: assignedIds,
            status,
            frequency,
            months,
            lastDoneAt,
            batteryChangedAt,
            observations,
        };
        try {
            const deletedPreventive = await Preventive.findOne({ branch, business });
            if (deletedPreventive != null) {
                deletedPreventive.assigned = assignedIds;
                deletedPreventive.status = status;
                deletedPreventive.frequency = frequency;
                deletedPreventive.months = months;
                deletedPreventive.lastDoneAt = lastDoneAt;
                deletedPreventive.batteryChangedAt = batteryChangedAt;
                deletedPreventive.observations = observations;
                await deletedPreventive.restore();
                return res.json({
                    statusCode: 200,
                    data: {
                        preventive: formatIds(deletedPreventive),
                        message: 'created Preventive succesfully',
                    },
                });
            }
            const newPreventive = await Preventive.create(preventiveForm);
            if (newPreventive === undefined) {
                return res.json({
                    statusCode: 500,
                    error: 'could not create Preventive',
                });
            }

            return res.json({
                statusCode: 200,
                data: {
                    preventive: formatIds(newPreventive),
                    message: 'created Preventive succesfully',
                },
            });
        } catch (error) {
            return res.json({ statusCode: 500, error: 'could not create Preventive' });
        }
    },
    deletePreventive: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        const { body } = req;
        await dbConnect();
        const deletedPreventive = await Preventive.findById(body._id);
        if (deletedPreventive == null) {
            return res.json({ statusCode: 500, error: 'could not delete Preventive' });
        }
        await deletedPreventive.softDelete();
        res.json({
            statusCode: 200,
            data: { message: 'deleted Preventive succesfully' },
        });
    },
};

export default PreventiveController;
