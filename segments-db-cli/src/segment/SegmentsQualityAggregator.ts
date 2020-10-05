import { IDatabaseClient } from '../database';
import { getLevels } from '../config/segment';

async function aggregateTerminalSegments(
  client: IDatabaseClient,
  layerId: string,
  terminalSegmentAccuracy: number,
  percentile: number,
) {
  await client.db.raw(`
  INSERT INTO layer_segment_quality_aggregation (segment_id, quality, layer_id)
  SELECT psq.segment_id,
         PERCENTILE_DISC(?) WITHIN GROUP(ORDER BY psq.quality DESC) as quality,
         ? as layer_id
  from profile_segment_quality psq
  join segment s on psq.segment_id = s.id
  where s.accuracy = ?
  group by psq.segment_id
  `, [percentile, layerId, terminalSegmentAccuracy]);
}

async function aggregateSegmentsByAccuracy(
  client: IDatabaseClient,
  statTableName: string,
  layerId: string,
  accuracy: number,
  percentile: number,
) {
  await client.db.raw(`
  INSERT INTO layer_segment_quality_aggregation (segment_id, quality, layer_id)
  SELECT s.parent_id AS segment_id,
         PERCENTILE_DISC(?) WITHIN GROUP(ORDER BY lsqa.quality DESC) as quality,
         ? AS layer_id
  FROM layer_segment_quality_aggregation lsqa
  JOIN segment s ON s.id = lsqa.segment_id
  JOIN segment ps ON ps.id = s.parent_id
  JOIN ?? stat ON stat.segment_id = ps.id
  WHERE lsqa.layer_id = ? AND ps.accuracy = ?
  GROUP BY s.parent_id
  HAVING COUNT(*)/MAX(stat.child_count) > 0.5
  `, [percentile, layerId, statTableName, layerId, accuracy]);
}

export default class SegmentsQualityAggregator {
  constructor(private readonly client: IDatabaseClient) {}

  public async aggregate(layerId: string, statTableName: string): Promise<void> {
    const levels = getLevels();
    const terminalLevel = Math.min(...levels);
    const parentLevels = levels.filter((level) => level !== terminalLevel);

    await aggregateTerminalSegments(this.client, layerId, terminalLevel, 0.5);

    // eslint-disable-next-line no-restricted-syntax
    for (const level of parentLevels) {
      // eslint-disable-next-line no-await-in-loop
      await aggregateSegmentsByAccuracy(this.client, statTableName, layerId, level, 0.7);
    }
  }
}
