import { createApiRouter } from '@/lib/createRouter';
import BusinessController from 'backend/controllers/BusinessController';
import { onError, onNoMatch } from 'backend/controllers/NextConnectController';
import accessControl from 'backend/middleware/accessControl';

const protectedHandler = createApiRouter();
protectedHandler.use(accessControl);
protectedHandler.post(BusinessController.postBusiness);

protectedHandler.put(BusinessController.putBusiness);

protectedHandler.delete(BusinessController.deleteBusiness);
protectedHandler.get((req, res) => {
    res.json({
        message: 'hello world',
    });
    return res.status(200);
});

export default protectedHandler.handler({
    onError: onError,
    onNoMatch: onNoMatch,
});
