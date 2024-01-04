import { PageConfig } from 'next';

import { createApiRouter } from '@/lib/createRouter';
import ImageController from 'backend/controllers/ImageController';
import { onError, onNoMatch } from 'backend/controllers/NextConnectController';
import uploadImage from 'backend/middleware/multer';

const router = createApiRouter()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .use(uploadImage.single('image') as any)
    .post(ImageController.postImage);

export const config: PageConfig = {
    api: {
        bodyParser: false,
    },
};

export default router.handler({
    onError: onError,
    onNoMatch: onNoMatch,
});
