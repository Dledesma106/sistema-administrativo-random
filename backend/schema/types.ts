import { User } from '@prisma/client';
import { YogaInitialContext } from 'graphql-yoga';

export type YogaContext<Authenticated = true> = YogaInitialContext &
    (Authenticated extends true ? { user: User } : Record<string, never>);
