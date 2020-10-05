import { v4 as uuidv4 } from 'uuid';
import { IOutput } from './model/IOutput';
import buildSegmentDbClient from '../segment/database';
import LayerManagement from '../segment/LayerManagement';
import { ILayer } from '../segment/model/ILayer';
import TempSegmentsStatTableBuilder from '../segment/TempSegmentsStatTableBuilder';
import SegmentsQualityAggregator from '../segment/SegmentsQualityAggregator';

function buildLayer() {
  return <ILayer>{
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    id: uuidv4() as string,
    code: 'default',
  };
}

/**
 * Command to aggregate segments quality.
 */
export default async function execute(output: IOutput): Promise<void> {
  const segmentDbClient = buildSegmentDbClient();
  const layerManagement = new LayerManagement(segmentDbClient);

  const layer = buildLayer();
  await layerManagement.create(layer);

  const statTableName = await (new TempSegmentsStatTableBuilder(segmentDbClient)).build();

  await (new SegmentsQualityAggregator(segmentDbClient)).aggregate(layer.id, statTableName);

  await segmentDbClient.db.schema.dropTable(statTableName);
}
