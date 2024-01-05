import { createApiRouter } from '@/lib/createRouter';
import { onError, onNoMatch } from 'backend/controllers/NextConnectController';
import PreventiveController from 'backend/controllers/PreventiveController';
import accessControl from 'backend/middleware/accessControl';

const protectedHandler = createApiRouter();
protectedHandler.use(accessControl);

protectedHandler.post(PreventiveController.postPreventive);

protectedHandler.put(PreventiveController.putPreventive);

protectedHandler.delete(PreventiveController.deletePreventive);

export default protectedHandler.handler({
    onError: onError,
    onNoMatch: onNoMatch,
});
