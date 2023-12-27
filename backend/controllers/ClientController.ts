import { type NextApiResponse } from 'next';

import { NextConnectApiRequest } from './interfaces';

import dbConnect from '@/lib/dbConnect';
import { mongooseDocumentToJSON } from '@/lib/utils';
import ClientModel from 'backend/models/Client';

const ClientController = {
    putClient: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        const {
            body: { _id, name },
        } = req;

        await dbConnect();
        const clientForm = {
            name,
        };
        const newClient = await ClientModel.findByIdAndUpdate(_id, clientForm, {
            new: true,
            runValidators: true,
        });
        if (newClient === null) {
            return res.json({
                statusCode: 500,
                error: 'could not update Client',
            });
        }
        const client = mongooseDocumentToJSON(newClient);
        res.json({
            data: {
                client,
                message: 'updated Client succesfully',
            },
        });
    },
    postClient: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        const {
            body: { name },
        } = req;
        await dbConnect();
        const clientForm = {
            name,
        };
        const deletedClient = await ClientModel.findOne({
            name,
        });
        if (deletedClient !== null) {
            await deletedClient.restore();
            return res.json({
                data: {
                    deletedClient,
                    message: 'created Client succesfully',
                },
            });
        }
        const newClient = await ClientModel.create(clientForm);
        if (newClient === undefined) {
            return res.json({
                statusCode: 500,
                error: 'could not create Client',
            });
        }

        const client = mongooseDocumentToJSON(newClient);
        res.json({
            data: {
                client,
                message: 'created Client succesfully',
            },
        });
    },
    deleteClient: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        const { body: _id } = req;
        await dbConnect();
        const deletedClient = await ClientModel.findById(_id);
        if (deletedClient === null) {
            return res.json({
                statusCode: 500,
                error: 'could not delete Client',
            });
        }
        await deletedClient.softDelete();
        res.json({
            data: {
                message: 'deleted Client succesfully',
            },
        });
    },
};

export default ClientController;
