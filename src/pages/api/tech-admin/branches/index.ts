import { createApiRouter } from '@/lib/createRouter';
import BranchController from 'backend/controllers/BranchController';
import { onError, onNoMatch } from 'backend/controllers/NextConnectController';
import accessControl from 'backend/middleware/accessControl';

const protectedHandler = createApiRouter();
protectedHandler.use(accessControl);
protectedHandler.post(BranchController.postBranch);

protectedHandler.put(BranchController.putBranch);

protectedHandler.delete(BranchController.deleteBranch);

export default protectedHandler.handler({
    onError: onError,
    onNoMatch: onNoMatch,
});
