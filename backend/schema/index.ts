import { builder } from './builder';
import './resolvers/users';
import './resolvers/province';
import './resolvers/city';
import './resolvers/task';
import './resolvers/branch';
import './resolvers/client';
import './resolvers/business';
import './resolvers/image';
import './resolvers/expense';
import './resolvers/preventive';
import './resolvers/auth';
import './resolvers/file';

export const schema = builder.toSchema();
