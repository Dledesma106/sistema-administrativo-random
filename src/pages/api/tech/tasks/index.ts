import { createApiRouter } from '@/lib/createRouter';
import { onError, onNoMatch } from 'backend/controllers/NextConnectController';
import TaskController from 'backend/controllers/TaskController';
import accessControl from 'backend/middleware/accessControl';

const { getTechTasks, postTechTask } = TaskController

const protectedHandler = createApiRouter();
protectedHandler.use(accessControl);
protectedHandler.get(getTechTasks);
protectedHandler.post(postTechTask);

export default protectedHandler.handler({
    onError: onError,
    onNoMatch: onNoMatch,
});
