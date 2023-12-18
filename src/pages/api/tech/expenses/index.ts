import { createApiRouter } from '@/lib/createRouter';
import ExpenseController from 'backend/controllers/ExpenseController';
import { onError, onNoMatch } from 'backend/controllers/NextConnectController';
import accessControl from 'backend/middleware/accessControl';

const router = createApiRouter().use(accessControl).post(ExpenseController.postTech);

export default router.handler({
    onError,
    onNoMatch,
});

export const config = {
    api: {
        bodyParser: false,
    },
};
