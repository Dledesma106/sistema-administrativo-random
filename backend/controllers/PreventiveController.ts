import { type NextApiResponse } from 'next';

import { NextConnectApiRequest } from './interfaces';

import dbConnect from '@/lib/dbConnect';
import { mongooseDocumentToJSON } from '@/lib/utils';
import { type User } from 'backend/models/User';

import PreventiveModel from '../models/Preventive';

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
            const newPreventive = await PreventiveModel.findByIdAndUpdate(
                _id,
                preventiveForm,
                {
                    new: true,
                    runValidators: true,
                },
            );
            if (newPreventive === null) {
                return res.json({
                    statusCode: 500,
                    error: 'could not update Preventive',
                });
            }

            return res.json({
                statusCode: 200,
                data: {
                    Preventive: mongooseDocumentToJSON(newPreventive),
                    message: 'updated Preventive succesfully',
                },
            });
        } catch (error) {
            return res.json({
                statusCode: 500,
                error: 'could not update Preventive',
            });
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
            const deletedPreventive = await PreventiveModel.findOne({
                branch,
                business,
            });
            if (deletedPreventive) {
                deletedPreventive.assignedIDs = assignedIds;
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
                        preventive: mongooseDocumentToJSON(deletedPreventive),
                        message: 'created Preventive succesfully',
                    },
                });
            }
            const newPreventive = await PreventiveModel.create(preventiveForm);
            if (newPreventive === undefined) {
                return res.json({
                    statusCode: 500,
                    error: 'could not create Preventive',
                });
            }

            return res.json({
                statusCode: 200,
                data: {
                    preventive: mongooseDocumentToJSON(newPreventive),
                    message: 'created Preventive succesfully',
                },
            });
        } catch (error) {
            return res.json({
                statusCode: 500,
                error: 'could not create Preventive',
            });
        }
    },
    deletePreventive: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        const { body } = req;
        await dbConnect();
        const deletedPreventive = await PreventiveModel.findById(body._id);
        if (deletedPreventive === null) {
            return res.json({
                statusCode: 500,
                error: 'could not delete Preventive',
            });
        }
        await deletedPreventive.softDelete();
        return res.json({
            statusCode: 200,
            data: {
                message: 'deleted Preventive succesfully',
            },
        });
    },
};

export default PreventiveController;
