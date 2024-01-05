import { createApiRouter } from '@/lib/createRouter';
import ClientController from 'backend/controllers/ClientController';
import { onError, onNoMatch } from 'backend/controllers/NextConnectController';
import accessControl from 'backend/middleware/accessControl';

const protectedHandler = createApiRouter();

protectedHandler.use(accessControl);

protectedHandler.post(ClientController.postClient);

protectedHandler.put(ClientController.putClient);

protectedHandler.delete(ClientController.deleteClient);

export default protectedHandler.handler({
    onError: onError,
    onNoMatch: onNoMatch,
});
