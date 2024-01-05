import { createApiRouter } from '@/lib/createRouter';
import { onError, onNoMatch } from 'backend/controllers/NextConnectController';
import TaskController from 'backend/controllers/TaskController';
import accessControl from 'backend/middleware/accessControl';

const protectedHandler = createApiRouter();
protectedHandler.use(accessControl);

protectedHandler.post(TaskController.postTask);
protectedHandler.put(TaskController.putTask);

export default protectedHandler.handler({
    onError: onError,
    onNoMatch: onNoMatch,
});
