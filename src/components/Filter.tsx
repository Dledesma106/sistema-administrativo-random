/* eslint-disable @typescript-eslint/no-explicit-any */
import { Label, Select } from 'flowbite-react';
import { type ChangeEvent, createRef } from 'react';

import { Button } from '@/components/ui/button';
interface Props {
    types: string[];
    entities: any[];
    selectType: (e: ChangeEvent<HTMLSelectElement>) => void;
    selectEntity: (e: ChangeEvent<HTMLSelectElement>) => void;
    clearFilter: () => void;
}

export default function Filter({
    types,
    entities,
    selectType,
    selectEntity,
    clearFilter,
}: Props): JSX.Element {
    const typeRef = createRef<HTMLSelectElement>();
    const entityRef = createRef<HTMLSelectElement>();

    function onSelectType(e: ChangeEvent<HTMLSelectElement>): void {
        selectType(e);
        if (entityRef.current === null) {
            return;
        }
        entityRef.current.selectedIndex = 0;
    }

    function onClearFilter(): void {
        clearFilter();
        if (typeRef.current === null) {
            return;
        }
        if (entityRef.current === null) {
            return;
        }
        typeRef.current.selectedIndex = 0;
        entityRef.current.selectedIndex = 0;
    }

    return (
        <div className="flex flex-col">
            <div className="flex flex-row items-center gap-4 p-4">
                <Label value="Filtrar por  " />
                <Select defaultValue="default" onChange={onSelectType} ref={typeRef}>
                    <option value="default" hidden disabled>
                        Seleccione el tipo...
                    </option>
                    {types.map((type: string, index: number) => (
                        <option key={index} value={type}>
                            {type}
                        </option>
                    ))}
                </Select>

                <Label value="Valor: " />
                <Select defaultValue="default" onChange={selectEntity} ref={entityRef}>
                    <option value="default" hidden disabled>
                        Seleccione la entidad...
                    </option>
                    {entities.map((entity: any, index: number) => (
                        <option
                            value={
                                entity.name !== undefined
                                    ? entity.name
                                    : entity.fullName !== undefined
                                      ? entity.fullName
                                      : entity
                            }
                            key={index}
                        >
                            {entity.name !== undefined
                                ? entity.name
                                : entity.fullName !== undefined
                                  ? entity.fullName
                                  : entity}
                        </option>
                    ))}
                </Select>
                <Button onClick={onClearFilter}>Borrar filtro</Button>
            </div>
        </div>
    );
}
