import Item from './Item';

import { type GetProvincesQuery } from '@/api/graphql';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface Props {
    provinces: NonNullable<GetProvincesQuery>['provinces'];
}

export default function ProvinceTable({ provinces }: Props): JSX.Element {
    return (
        <Table>
            <TableHeader className="border-b bg-white">
                <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead className="w-40 text-center">Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {provinces.map((province, index) => (
                    <Item key={index} province={province} />
                ))}
            </TableBody>
        </Table>
    );
}
