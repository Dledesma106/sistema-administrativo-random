import { createApiRouter } from '@/lib/createRouter';
import { onError, onNoMatch } from 'backend/controllers/NextConnectController';
import UserController from 'backend/controllers/UserController';
import accessControl from 'backend/middleware/accessControl';

const protectedHandler = createApiRouter();
protectedHandler.use(accessControl);

protectedHandler.put(UserController.generateNewPassword);

export default protectedHandler.handler({
    onError: onError,
    onNoMatch: onNoMatch,
});
