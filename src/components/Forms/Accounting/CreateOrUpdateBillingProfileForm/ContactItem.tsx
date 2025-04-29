import { Pencil, Trash2 } from 'lucide-react';

import { ContactFormValues } from './ContactForm';

import { Button } from '@/components/ui/button';

interface ContactItemProps {
    contact: ContactFormValues;
    onEdit: (contact: ContactFormValues) => void;
    onDelete: (contact: ContactFormValues) => void;
}

export const ContactItem = ({
    contact,
    onEdit,
    onDelete,
}: ContactItemProps): JSX.Element => {
    return (
        <div className="flex items-start justify-between rounded-md border border-accent bg-background-primary p-4">
            <div className="space-y-1">
                <p className="font-semibold">{contact.name}</p>
                <p className="text-sm text-muted-foreground">{contact.email}</p>
                <p className="text-sm text-muted-foreground">{contact.phone}</p>
                {contact.notes && (
                    <p className="text-sm text-muted-foreground">{contact.notes}</p>
                )}
            </div>
            <div className="flex gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onEdit(contact);
                    }}
                    className="h-8 w-8"
                >
                    <Pencil className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(contact)}
                    className="h-8 w-8"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};
