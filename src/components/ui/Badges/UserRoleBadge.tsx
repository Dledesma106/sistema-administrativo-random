import { Role } from '@prisma/client';
import clsx from 'clsx';

import { Badge } from '@/components/ui/Badges/badge';
import { capitalizeFirstLetter, pascalCaseToSpaces } from '@/lib/utils';

interface UserRoleBadgeProps {
    role: Role;
}

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
    const contentStyle = clsx({
        'h-2 w-2 rounded-full bg-blue-500': role === Role.AdministrativoContable,
        'h-2 w-2 rounded-full bg-green-500': role === Role.AdministrativoTecnico,
        'h-2 w-2 rounded-full bg-purple-500': role === Role.Auditor,
        'h-2 w-2 rounded-full bg-yellow-500': role === Role.Tecnico,
    });

    return (
        <Badge
            className="gap-2"
            variant="default"
        >
            <span className={contentStyle} />
            <span>{capitalizeFirstLetter(pascalCaseToSpaces(role))}</span>
        </Badge>
    );
} 