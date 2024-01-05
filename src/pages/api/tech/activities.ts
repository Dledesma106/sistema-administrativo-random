import { createApiRouter } from '@/lib/createRouter';
import ActivityController from 'backend/controllers/ActivityController';
import { onError, onNoMatch } from 'backend/controllers/NextConnectController';
import accessControl from 'backend/middleware/accessControl';

const router = createApiRouter()
    .use(accessControl)
    .get(ActivityController.getTechActivities);

export default router.handler({
    onError,
    onNoMatch,
});
