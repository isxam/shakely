import { QueryBuilder } from 'knex';
import { IOsmLine } from './model/IOsmLine';
import { IDatabaseClient } from '../database';

const BATCH_SIZE = 100;

export default class HighwayLinesProvider {
  constructor(private readonly client: IDatabaseClient) {}

  public async* getLines(): AsyncIterableIterator<IOsmLine> {
    let page = 0;
    let rows = [];

    do {
      // eslint-disable-next-line no-await-in-loop
      rows = await this.buildBatchQuery(page * BATCH_SIZE, BATCH_SIZE);

      yield* rows;

      page += 1;
    } while (rows.length === BATCH_SIZE);
  }

  private buildBatchQuery(offset: number, size: number): QueryBuilder<IOsmLine, Array<IOsmLine>> {
    const { db, st } = this.client;

    return db.select('osm_id', st.asGeoJSON(st.transform('way', 4326)).as('way_geojson'))
      .from('planet_osm_line')
      .orderBy('osm_id')
      .offset(offset)
      .where('osm_id', '>', 0)
      .whereNotNull('highway')
      .limit(size);
  }
}
