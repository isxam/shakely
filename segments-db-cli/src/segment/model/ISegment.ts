import Knex from 'knex';

export interface ISegment {
  id: string;
  accuracy: number;
  parent_id: string | null;
  osm_line_id: number;
  way: Knex.Raw;
}
