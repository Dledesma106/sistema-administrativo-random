import { createApiRouter } from '@/lib/createRouter';
import { onError, onNoMatch } from 'backend/controllers/NextConnectController';
import TaskController from 'backend/controllers/TaskController';
import accessControl from 'backend/middleware/accessControl';

const protectedHandler = createApiRouter();
protectedHandler.use(accessControl);
protectedHandler.get(TaskController.getTechTasks);
protectedHandler.post(TaskController.postTechTask);

export default protectedHandler.handler({
    onError: onError,
    onNoMatch: onNoMatch,
});
