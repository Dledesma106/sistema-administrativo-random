import { createApiRouter } from '@/lib/createRouter';
import BranchController from 'backend/controllers/BranchController';
import { onError, onNoMatch } from 'backend/controllers/NextConnectController';
import accessControl from 'backend/middleware/accessControl';

const router = createApiRouter().use(accessControl).get(BranchController.getTech);

export default router.handler({
    onError,
    onNoMatch,
});
