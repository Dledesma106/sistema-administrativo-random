import { createApiRouter } from '@/lib/createRouter';
import AuthController from 'backend/controllers/AuthController';
import { onError, onNoMatch } from 'backend/controllers/NextConnectController';
import accessControl from 'backend/middleware/accessControl';

const router = createApiRouter().use(accessControl).post(AuthController.changePassword);

export default router.handler({
    onError,
    onNoMatch,
});
