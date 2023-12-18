import { createApiRouter } from '@/lib/createRouter';
import ExpenseController from 'backend/controllers/ExpenseController';
import { onError, onNoMatch } from 'backend/controllers/NextConnectController';
import accessControl from 'backend/middleware/accessControl';

const router = createApiRouter().use(accessControl).get(ExpenseController.getTech);

export default router.handler({
    onError,
    onNoMatch,
});
