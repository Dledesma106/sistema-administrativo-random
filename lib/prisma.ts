import { Prisma, PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

const prismaClientSingleton = () => {
    return new PrismaClient()
        .$extends({
            query: {
                user: {
                    async $allOperations({ args, operation, query }) {
                        if (
                            !['create', 'update'].includes(operation) ||
                            !('data' in args)
                        ) {
                            return query(args);
                        }

                        if ('password' in args.data && args.data.password) {
                            args.data.password = getUpdatedStringFieldValue(
                                { password: args.data.password },
                                'password',
                                (value) => hashSync(value, 10),
                            );
                        }

                        if ('firstName' in args.data && args.data.firstName) {
                            args.data.firstName = getUpdatedStringFieldValue(
                                { firstName: args.data.firstName },
                                'firstName',
                                (value) => value.trim(),
                            );
                        }

                        if ('lastName' in args.data && args.data.lastName) {
                            args.data.lastName = getUpdatedStringFieldValue(
                                { lastName: args.data.lastName },
                                'lastName',
                                (value) => value.trim(),
                            );
                        }

                        if (operation === 'create') {
                            const cur = await query(args);
                            return await defaultPrisma.user.update({
                                data: {
                                    fullName: `${cur.firstName} ${cur.lastName}`,
                                },
                                where: {
                                    id: cur.id,
                                },
                            });
                        } else if (operation === 'update') {
                            const cur = await query(args);
                            return await defaultPrisma.user.update({
                                data: {
                                    fullName: `${cur.firstName} ${cur.lastName}`,
                                },
                                where: {
                                    id: cur.id,
                                },
                            });
                        }

                        return query(args);
                    },
                },
            },
        })
        .$extends({
            model: {
                $allModels: {
                    async exists<T>(
                        this: T,
                        where: Prisma.Args<T, 'findFirst'>['where'],
                    ): Promise<boolean> {
                        const context = Prisma.getExtensionContext(this);
                        const result = await (context as any).findFirst({ where });
                        return result !== null;
                    },
                    async softDeleteOne<T, A>(
                        this: T,
                        where: Prisma.Exact<A, Prisma.Args<T, 'update'>['where']>,
                    ): Promise<Prisma.Result<T, A, 'update'>> {
                        const context = Prisma.getExtensionContext(this);
                        return await (context as any).update({
                            where,
                            data: {
                                deleted: true,
                                deletedAt: new Date(),
                            },
                        });
                    },
                    async findUniqueUndeleted<T, A>(
                        this: T,
                        args: Prisma.Args<T, 'findUnique'>,
                    ): Promise<Prisma.Result<T, A, 'findUnique'>> {
                        const context = Prisma.getExtensionContext(this);
                        return await (context as any).findUnique({
                            ...args,
                            where: {
                                ...args.where,
                                deleted: false,
                            },
                        });
                    },
                    async findManyUndeleted<T, A>(
                        this: T,
                        args: Prisma.Args<T, 'findMany'>,
                    ): Promise<Prisma.Result<T, A, 'findMany'>> {
                        const context = Prisma.getExtensionContext(this);
                        return await (context as any).findMany({
                            ...args,
                            where: {
                                ...args.where,
                                deleted: false,
                            },
                        });
                    },
                },
            },
        });
};

const globalForPrisma = global as unknown as {
    prisma: ReturnType<typeof prismaClientSingleton>;
};
const globalForDefaultPrisma = global as unknown as { defaultPrisma: PrismaClient };

const defaultPrisma = globalForDefaultPrisma.defaultPrisma || new PrismaClient();

export const prisma = globalForPrisma.prisma || prismaClientSingleton();

const getUpdatedStringFieldValue = <
    Data extends Record<Key, Value>,
    Key extends string,
    Value extends string | Prisma.StringFieldUpdateOperationsInput | undefined,
>(
    data: Data,
    key: Key,
    updateFn: (value: string) => string,
): string | undefined => {
    const value = data[key];

    if (typeof value === 'string') {
        return updateFn(value);
    }

    if (!value || !value.set) {
        return value?.set ?? undefined;
    }

    return updateFn(value.set);
};

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
    globalForDefaultPrisma.defaultPrisma = defaultPrisma;
}
