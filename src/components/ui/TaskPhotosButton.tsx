import { Button } from '@/components/ui/button';
import { TaskPhotosModal } from '@/components/Modals/TaskPhotosModal';
import { useState } from 'react';
import { GetBusinessesQuery } from '@/api/graphql';

type Props = {
    businesses?: NonNullable<GetBusinessesQuery['businesses']>;
};

export function TaskPhotosButton({ businesses = [] }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setIsModalOpen(true)}>
                Descargar Fotos de Tareas
            </Button>

            <TaskPhotosModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                businesses={businesses}
            />
        </>
    );
}
