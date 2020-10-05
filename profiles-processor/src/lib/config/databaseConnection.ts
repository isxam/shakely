import config from 'config';
import { PgConnectionConfig } from 'knex';

// eslint-disable-next-line import/prefer-default-export
export function getDatabaseConnectionConfig(path: string): PgConnectionConfig {
  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  return config.get(path) as PgConnectionConfig;
}
