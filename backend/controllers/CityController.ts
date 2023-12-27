import { type NextApiResponse } from 'next';

import { NextConnectApiRequest } from './interfaces';

import dbConnect from '@/lib/dbConnect';
import { formatIds } from '@/lib/utils';
import CityModel from 'backend/models/City';

const CityController = {
    putCity: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        const {
            body: { _id, name, province },
        } = req;

        await dbConnect();
        const cityForm = { name, province: province._id };
        const newCity = await CityModel.findByIdAndUpdate(_id, cityForm, {
            new: true,
            runValidators: true,
        });
        if (newCity == null) {
            return res.json({ statusCode: 500, error: 'could not update city' });
        }
        const city = formatIds(newCity);
        res.json({ data: { city, message: 'updated city succesfully' } });
    },
    postCity: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        const {
            body: { name, province },
        } = req;
        await dbConnect();
        const cityForm = { name, province: province._id };
        try {
            const deletedCity = await CityModel.findOne({ name });
            if (deletedCity != null) {
                deletedCity.province = province._id;
                await deletedCity.restore();
                return res.json({
                    data: { deletedCity, message: 'created city succesfully' },
                });
            }
            const newCity = await CityModel.create(cityForm);
            const city = formatIds(newCity);
            return res.json({ data: { city, message: 'created city succesfully' } });
        } catch (error) {
            return res.json({ statusCode: 500, error: 'could not create city' });
        }
    },
    deleteCity: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        const {
            body: { _id },
        } = req;

        await dbConnect();
        const deletedCity = await CityModel.findById(_id);
        if (deletedCity == null) {
            return res.json({ statusCode: 500, error: 'could not delete city' });
        }
        await deletedCity.softDelete();

        res.json({ data: { message: 'deleted city succesfully' } });
    },
};

export default CityController;
