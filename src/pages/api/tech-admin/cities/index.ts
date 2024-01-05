import { createApiRouter } from '@/lib/createRouter';
import CityController from 'backend/controllers/CityController';
import { onError, onNoMatch } from 'backend/controllers/NextConnectController';
import accessControl from 'backend/middleware/accessControl';

const protectedHandler = createApiRouter();
protectedHandler.use(accessControl);

protectedHandler.post(CityController.postCity);

protectedHandler.put(CityController.putCity);

protectedHandler.delete(CityController.deleteCity);

export default protectedHandler.handler({
    onError: onError,
    onNoMatch: onNoMatch,
});
