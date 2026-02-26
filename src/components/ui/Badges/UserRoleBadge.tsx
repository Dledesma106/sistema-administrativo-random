import { Role } from '@prisma/client';
import clsx from 'clsx';

import { Badge } from '@/components/ui/Badges/badge';
import { capitalizeFirstLetter, pascalCaseToSpaces } from '@/lib/utils';

interface UserRoleBadgeProps {
    role: Role;
}

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
    const contentStyle = clsx({
        'bg-blue-500': role === Role.AdministrativoContable,
        'bg-green-500': role === Role.AdministrativoTecnico,
        'bg-purple-500': role === Role.Auditor,
        'bg-yellow-500': role === Role.Tecnico,
    });

    return (
        <Badge className={contentStyle} variant="default">
            <span className={contentStyle} />
            <span>{capitalizeFirstLetter(pascalCaseToSpaces(role))}</span>
        </Badge>
    );
}
