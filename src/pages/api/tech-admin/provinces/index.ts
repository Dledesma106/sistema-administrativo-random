import { createApiRouter } from '@/lib/createRouter';
import { onError, onNoMatch } from 'backend/controllers/NextConnectController';
import ProvinceController from 'backend/controllers/ProvinceController';
import accessControl from 'backend/middleware/accessControl';

const protectedHandler = createApiRouter();
protectedHandler.use(accessControl);

protectedHandler.post(ProvinceController.postProvince);

protectedHandler.put(ProvinceController.putProvince);

protectedHandler.delete(ProvinceController.deleteProvince);

export default protectedHandler.handler({
    onError: onError,
    onNoMatch: onNoMatch,
});
