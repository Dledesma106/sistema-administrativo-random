import Image from '../models/Image'
import { uploadImage } from 'lib/googleStorage';
import { NextConnectApiRequest} from './interfaces';
import { ResponseData } from './types';
import { NextApiResponse } from 'next';

export const postImage = async (req: NextConnectApiRequest, res: NextApiResponse<ResponseData>) => {

    const file = req.files[0]
    const newImage = {name:file.originalname, url:`https://storage.cloud.google.com/random-images-bucket/${file.originalname}?authuser=2`}
    const image = await Image.create(newImage)
    const {blobStream} = await uploadImage(file.originalname)
  
    blobStream.on('error', (err) => {
      res.status(500).json({error:(err as unknown) as string  });
    });
    blobStream.end(file.buffer)
    res.status(200).json({ data: [image._id]});
}