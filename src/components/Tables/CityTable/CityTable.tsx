import { type ChangeEvent, useState } from 'react';

import Item from './Item';

import Filter from '@/components/Filter';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { CitiesProps } from '@/pages/tech-admin/cities';

export default function CityTable({ cities, provinces }: CitiesProps): JSX.Element {
    const [tableCities, setTableCities] = useState(cities);
    const [type, setType] = useState<string>('');
    const [entities, setEntities] = useState<any[]>([] as any[]);
    const filterTypes = ['Provincia'];

    function selectEntity(e: ChangeEvent<HTMLSelectElement>): void {
        const { value } = e.target;

        switch (type) {
            case 'Provincia':
                setTableCities(cities.filter((city) => city.province.name === value));
                break;
            default:
                setTableCities(cities);
                break;
        }
    }

    function selectType(e: ChangeEvent<HTMLSelectElement>): void {
        const { value } = e.target;

        setType(value);
        switch (value) {
            case 'Provincia':
                setEntities(provinces);
                break;
            default:
                break;
        }
    }

    function clearFilter(): void {
        setType('');
        setEntities([]);
        setTableCities(cities);
    }
    const deleteCity = (id: string): void => {
        setTableCities((prev) => {
            return prev.filter((city) => city.id !== id);
        });
    };

    return (
        <div className="mb-6">
            <Filter
                types={filterTypes}
                entities={entities}
                selectType={selectType}
                selectEntity={selectEntity}
                clearFilter={clearFilter}
            />

            <Table>
                <TableHeader className="border-b bg-white">
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Provincia</TableHead>
                        <TableHead className="w-40 text-center">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tableCities.map((city, index) => (
                        <Item key={index} city={city} deleteCity={deleteCity} />
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
