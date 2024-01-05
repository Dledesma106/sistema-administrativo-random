import { type NextApiResponse } from 'next';

import { NextConnectApiRequest } from './interfaces';

import dbConnect from '@/lib/dbConnect';
import { mongooseDocumentToJSON } from '@/lib/utils';
import ActivityModel from 'backend/models/Activity';
import UserModel from 'backend/models/User';

const ActivityController = {
    getActivities: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        await dbConnect();
        const docActivities = ActivityModel.find({});
        return res.json({
            data: {
                activities: mongooseDocumentToJSON(docActivities),
            },
            statusCode: 200,
        });
    },
    getTechActivities: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        const { userId } = req;
        await dbConnect();
        const docUser = await UserModel.findById(userId);
        if (docUser === null) {
            return res.json({
                error: 'no user logged in',
                statusCode: 403,
            });
        }
        const docActivities = docUser.getActivities();
        return res.json({
            data: {
                activities: mongooseDocumentToJSON(docActivities),
            },
            statusCode: 200,
        });
    },
};

export default ActivityController;
