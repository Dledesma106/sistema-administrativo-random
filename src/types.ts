import { ICity, IProvince } from 'backend/models/interfaces';

export type CityWithProvince = Pick<ICity, '_id' | 'name'> & {
    province: Pick<IProvince, 'name'>;
};
