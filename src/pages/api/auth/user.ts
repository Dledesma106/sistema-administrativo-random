import { createApiRouter } from '@/lib/createRouter';
import { onError, onNoMatch } from 'backend/controllers/NextConnectController';
import UserController from 'backend/controllers/UserController';
import accessControl from 'backend/middleware/accessControl';

const router = createApiRouter().use(accessControl).get(UserController.getLoggedInUser);

export default router.handler({
    onError: onError,
    onNoMatch: onNoMatch,
});
