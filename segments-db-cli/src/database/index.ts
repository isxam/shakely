import KnexPostgis from 'knex-postgis';
import Knex, { PgConnectionConfig } from 'knex';

export interface IDatabaseClient {
  db: Knex,
  st: KnexPostgis.KnexPostgis
}

export function buildClient(config: PgConnectionConfig): IDatabaseClient {
  const db = Knex({
    client: 'postgres',
    connection: config,
  });
  const st = KnexPostgis(db);

  return {
    db,
    st,
  };
}
