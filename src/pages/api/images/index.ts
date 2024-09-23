import { createApiRouter } from '@/lib/createRouter';
import ImageController from 'backend/controllers/ImageController';
import { onError, onNoMatch } from 'backend/controllers/NextConnectController';

const router = createApiRouter().post(ImageController.postImage);
export default router.handler({
    onError: onError,
    onNoMatch: onNoMatch,
});
