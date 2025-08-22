import { useState } from 'react';

import EmailThreadDetail from './EmailThreadDetail';
import EmailThreadList from './EmailThreadList';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Tipos para hilos de mail
export type EmailMessage = {
    id: string;
    from: string;
    to: string[];
    cc?: string[];
    timestamp: string;
    content: string;
    type: 'SENT' | 'RECEIVED' | 'FORWARDED';
};

export type EmailThread = {
    id: string;
    subject: string;
    messages: EmailMessage[];
};

type Props = {
    open: boolean;
    onClose: () => void;
    onSelect: (thread: EmailThread) => void;
    selectedThread?: EmailThread | null;
};

const mockEmailThreads: EmailThread[] = [
    {
        id: 'thread-1',
        subject: 'Re: Presupuesto #1 - Empresa A',
        messages: [
            {
                id: 'email-1',
                from: 'juan.perez@empresaa.com',
                to: ['ventas@miempresa.com'],
                timestamp: '2024-03-20T10:30:00Z',
                content:
                    'Buenos días,\n\nNecesitaría un presupuesto para los servicios mencionados anteriormente.\n\nSaludos cordiales,\nJuan Pérez',
                type: 'RECEIVED',
            },
            {
                id: 'email-2',
                from: 'ventas@miempresa.com',
                to: ['juan.perez@empresaa.com'],
                cc: ['gerencia@miempresa.com'],
                timestamp: '2024-03-20T14:15:00Z',
                content:
                    'Estimado Juan,\n\nAdjunto el presupuesto solicitado.\nQuedo a disposición por cualquier consulta.\n\nSaludos,\nDepartamento de Ventas',
                type: 'SENT',
            },
        ],
    },
    {
        id: 'thread-2',
        subject: 'Consulta sobre facturación',
        messages: [
            {
                id: 'email-3',
                from: 'soporte@cliente.com',
                to: ['ventas@miempresa.com'],
                timestamp: '2024-03-21T09:45:00Z',
                content:
                    'Hola,\n\nQuisiera consultar sobre la factura enviada.\n\nGracias,\nSoporte',
                type: 'RECEIVED',
            },
        ],
    },
];

export default function EmailSearchModal({
    open,
    onClose,
    onSelect,
    selectedThread,
}: Props) {
    const [selected, setSelected] = useState<EmailThread | null>(selectedThread || null);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="flex h-[80vh] min-w-[900px] max-w-4xl">
                <DialogHeader className="px-8 pb-2 pt-8">
                    <DialogTitle>Buscar cadenas de mails</DialogTitle>
                </DialogHeader>
                <div className="flex flex-1 gap-6 overflow-hidden px-8 pb-2">
                    <div className="flex h-full w-96 flex-col border-r border-accent pr-4">
                        <EmailThreadList
                            threads={mockEmailThreads}
                            onSelect={setSelected}
                            selectedId={selected?.id}
                        />
                    </div>
                    <div className="h-full flex-1 overflow-y-auto pl-4">
                        {selected ? (
                            <EmailThreadDetail thread={selected} />
                        ) : (
                            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                Selecciona una cadena para ver el detalle
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex justify-end gap-2 border-t border-accent px-8 pb-8 pt-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={() => {
                            if (selected) {
                                onSelect(selected);
                            }
                            onClose();
                        }}
                        disabled={!selected}
                    >
                        Seleccionar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
