import { Label, Select } from 'flowbite-react'
import { type ChangeEvent, createRef } from 'react'

interface props {
    types: string[]
    entities: any[]
    selectType: (e: ChangeEvent<HTMLSelectElement>) => void
    selectEntity: (e: ChangeEvent<HTMLSelectElement>) => void
    clearFilter: () => void
}

export default function Filter({ types, entities, selectType, selectEntity, clearFilter }: props): JSX.Element {
    const typeRef = createRef<HTMLSelectElement>()
    const entityRef = createRef<HTMLSelectElement>()

    function onSelectType(e: ChangeEvent<HTMLSelectElement>): void {
        selectType(e)
        if (entityRef.current == null) return
        entityRef.current.selectedIndex = 0
    }

    function onClearFilter(): void {
        clearFilter()
        if (typeRef.current == null) return
        if (entityRef.current == null) return
        typeRef.current.selectedIndex = 0
        entityRef.current.selectedIndex = 0
    }

    return (
        <div className='flex flex-col'>
            Filtro
            <hr />
            <div className='flex flex-row'>
                <Label
                    value='Filtrar por  '
                />
                <Select
                defaultValue='default'
                placeholder='default'
                onChange={onSelectType}
                ref={typeRef}
                >
                    <option value="default" hidden disabled>Seleccione el tipo...</option>
                    {types.map((type: string, index: number) => <option key={index} value={type}>{type}</option>)}
                </Select>
                <Label
                    value='Entidad: '
                />
                <Select
                defaultValue='default'
                placeholder='default'
                onChange={selectEntity}
                ref={entityRef}
                >
                    <option value="default" hidden disabled>Seleccione la entidad...</option>
                    {entities.map((entity: any, index: number) => <option value={entity.name !== undefined ? entity.name : entity.fullName} key={index}>{entity.name !== undefined ? entity.name : entity.fullName}</option>)}
                </Select>
                <button onClick={onClearFilter}>
                    Borrar filtro
                </button>
            </div>
        </div>
    )
}
