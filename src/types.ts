import { ICity, IProvince } from 'backend/models/interfaces';

export type CityWithProvince = Pick<ICity, '_id' | 'name'> & {
    provinceId: Pick<IProvince, 'name'>;
};

export type ElementType<T> = T extends (infer U)[] ? U : never;
