import { getDatabaseConnectionConfig } from '../../config/databaseConnection';
import { IDatabaseClient, buildClient as buildDatabaseClient } from '../../database';

let client: IDatabaseClient = null;

export default function buildClient(): IDatabaseClient {
  if (client !== null) {
    return client;
  }

  const connection = getDatabaseConnectionConfig('segment.db');
  client = buildDatabaseClient(connection);

  return client;
}
