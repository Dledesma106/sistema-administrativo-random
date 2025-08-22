import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    currentPrice: number;
    onUpdatePrice: (newPrice: number) => void;
    isUpdating: boolean;
};

export function UpdatePriceModal({
    isOpen,
    onClose,
    currentPrice,
    onUpdatePrice,
    isUpdating,
}: Props) {
    const [newPrice, setNewPrice] = useState<string>('');

    const handleUpdate = () => {
        const price = parseFloat(newPrice);
        if (!isNaN(price) && price > 0) {
            onUpdatePrice(price);
            setNewPrice('');
            onClose();
        }
    };

    const handleClose = () => {
        setNewPrice('');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="border-accent">
                <DialogHeader>
                    <DialogTitle>Actualizar Precio</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                    Ingresa el nuevo precio para esta tarea
                </p>
                <div className="grid gap-4 py-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="current-price">Precio actual</Label>
                        <Input
                            id="current-price"
                            value={currentPrice.toLocaleString('es-AR', {
                                style: 'currency',
                                currency: 'ARS',
                            })}
                            disabled
                            className="bg-muted"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="new-price">Nuevo precio</Label>
                        <Input
                            id="new-price"
                            type="number"
                            placeholder="Ingresa el nuevo precio"
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                            min="0"
                            step="0.01"
                        />
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button variant="outline" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleUpdate}
                            disabled={
                                isUpdating || !newPrice || parseFloat(newPrice) <= 0
                            }
                        >
                            {isUpdating ? 'Actualizando...' : 'Actualizar Precio'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
