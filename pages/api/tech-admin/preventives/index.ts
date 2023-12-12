import nc from 'next-connect';

import { onError, onNoMatch } from 'backend/controllers/NextConnectController';
import PreventiveController from 'backend/controllers/PreventiveController';
import accessControl from 'backend/middleware/accessControl';

const protectedHandler = nc({ onError, onNoMatch });
protectedHandler.use(accessControl);

protectedHandler.post(PreventiveController.postPreventive);

protectedHandler.put(PreventiveController.putPreventive);

protectedHandler.delete(PreventiveController.deletePreventive);

export default protectedHandler;
