import { v4 as uuidv4 } from 'uuid';
import { IDatabaseClient } from '../database';

async function createTempTable(client: IDatabaseClient): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const name = `tmp_segment_child_count_${uuidv4() as string}`;

  await client.db.schema.createTable(name, (table) => {
    table.uuid('segment_id').notNullable().primary();
    table.integer('child_count').notNullable();
  });

  return name;
}

async function fillTable(client: IDatabaseClient, name: string) {
  await client.db.raw(`
    INSERT INTO ?? 
    SELECT parent_id AS segment_id, COUNT(*) AS child_count FROM segment WHERE parent_id IS NOT NULL GROUP BY parent_id`, [name]);
}

export default class TempSegmentsStatTableBuilder {
  constructor(private readonly client: IDatabaseClient) {}

  public async build(): Promise<string> {
    const statTableName = await createTempTable(this.client);

    await fillTable(this.client, statTableName);

    return statTableName;
  }
}
