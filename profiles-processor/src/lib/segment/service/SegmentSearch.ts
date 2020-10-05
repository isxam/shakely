import { Geometry, Feature, FeatureCollection } from 'geojson';
import { IDatabaseClient } from '../../db';

interface IResultRow {
  id: string
  osm_line_id: string
  way_geometry_geojson: string
}

interface ISegment {
  id: number
  osm_line_id: string
  way: number
  accuracy: number
}

/**
 * Build feature from segment row.
 */
function buildFeatureFromSegmentRow(row: IResultRow): Feature {
  return {
    type: 'Feature',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    geometry: JSON.parse(row.way_geometry_geojson),
    properties: {
      segment_id: row.id,
      parent_osm_id: row.osm_line_id,
    },
  };
}

/**
 * Build feature collection from segment rows.
 */
function buildFeatureCollectionFromSegmentRows(rows: IResultRow[]): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: rows.map((row) => buildFeatureFromSegmentRow(row)),
  };
}

export default class SegmentSearch {
  private readonly client: IDatabaseClient;

  constructor(client: IDatabaseClient) {
    this.client = client;
  }

  async searchByGeometry(geometry: Geometry, precision: number): Promise<FeatureCollection> {
    const {
      db,
      st: {
        asGeoJSON,
        buffer,
        geomFromGeoJSON,
        transform,
        within,
      },
    } = this.client;

    const bufferedGeometrySql = buffer(
      transform(
        geomFromGeoJSON(geometry),
        900913,
      ),
      precision,
    );

    const query = db<ISegment, IResultRow[]>('segment')
      .select(
        '*',
        asGeoJSON(transform('way', 4326)).as('way_geometry_geojson'),
      )
      .where(
        within('way', bufferedGeometrySql),
        '=',
        true,
      )
      .andWhere({
        accuracy: 5,
      });

    const rows = await query;

    return buildFeatureCollectionFromSegmentRows(rows);
  }
}
