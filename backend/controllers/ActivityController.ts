import { type NextApiResponse } from 'next';

import dbConnect from '@/lib/dbConnect';
import { formatIds } from '@/lib/utils';
import Activity from 'backend/models/Activity';
import UserModel from 'backend/models/User';
import { NextConnectApiRequest } from './interfaces';

const ActivityController = {
    getActivities: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        await dbConnect();
        const docActivities = Activity.find({});
        res.json({ data: { activities: formatIds(docActivities) }, statusCode: 200 });
    },
    getTechActivities: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        const { userId } = req;
        await dbConnect();
        const docUser = await UserModel.findById(userId);
        if (docUser == null)
            return res.json({ error: 'no user logged in', statusCode: 403 });
        const docActivities = docUser.getActivities();
        res.json({ data: { activities: formatIds(docActivities) }, statusCode: 200 });
    },
};

export default ActivityController;
