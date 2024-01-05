import { createApiRouter } from '@/lib/createRouter';
import BusinessController from 'backend/controllers/BusinessController';
import { onError, onNoMatch } from 'backend/controllers/NextConnectController';
import accessControl from 'backend/middleware/accessControl';

const router = createApiRouter().use(accessControl).get(BusinessController.getTech);

export default router.handler({
    onError,
    onNoMatch,
});
