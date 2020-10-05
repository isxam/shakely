import { v4 as uuidv4 } from 'uuid';
import { LineString, Units } from '@turf/turf';
import KnexPostgis from 'knex-postgis';
import { IOutput } from './model/IOutput';
import buildOsmDbClient from '../osm/database';
import buildSegmentDbClient from '../segment/database';
import HighwayLinesProvider from '../osm/HighwayLinesProvider';
import lineTreeChunk, { ISegmentTree } from '../geometry/lineTreeChunk';
import { IOsmLine } from '../osm/model/IOsmLine';
import { ISegment } from '../segment/model/ISegment';
import BatchProcessor from '../database/BatchProcessor';
import { getLevels } from '../config/segment';

const batchSize = 1000;
const levels = getLevels();
const levelsUnits: Units = 'meters';

interface IFlatSegment {
  id: string,
  level: number,
  parent_id: string | null,
  geometry: LineString
}

function convertSegmentTreeNodeToFlatSegment(
  node: ISegmentTree,
  parentId: string | null,
): IFlatSegment {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const id = uuidv4() as string;

  return <IFlatSegment>{
    id,
    level: node.level,
    parent_id: parentId,
    geometry: node.geometry,
  };
}

function flatSegmentsTreesToSegments(
  segmentTrees: Array<ISegmentTree>,
  parentId: string | null,
): Array<IFlatSegment> {
  let segments = Array<IFlatSegment>();

  segmentTrees.forEach((segmentTree) => {
    segments = segments.concat(
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      flatSegmentTreeToSegments(segmentTree, parentId),
    );
  });

  return segments;
}

function flatSegmentTreeToSegments(
  segmentTree: ISegmentTree,
  parentId: string | null,
): Array<IFlatSegment> {
  const segment = convertSegmentTreeNodeToFlatSegment(segmentTree, parentId);
  const childrenSegments = flatSegmentsTreesToSegments(segmentTree.children, segment.id);

  return [segment].concat(childrenSegments);
}

function convertOsmLineToSegments(line: IOsmLine, st: KnexPostgis.KnexPostgis): Array<ISegment> {
  const lineGeometry = JSON.parse(line.way_geojson) as LineString;
  const segmentTree = lineTreeChunk(lineGeometry, levels, levelsUnits);

  const flatSegments = flatSegmentsTreesToSegments(segmentTree.children, null);

  return flatSegments.map((flatSegment: IFlatSegment) => {
    const geometry = st.geomFromGeoJSON(
      JSON.stringify(flatSegment.geometry),
    );

    return <ISegment>{
      id: flatSegment.id,
      accuracy: flatSegment.level,
      parent_id: flatSegment.parent_id,
      osm_line_id: line.osm_id,
      way: st.transform(geometry, 900913),
    };
  });
}

/**
 * Command to split all lines from OSM database to tree-like segments
 * and store into segments database.
 */
export default async function execute(output: IOutput): Promise<void> {
  const osmDbClient = buildOsmDbClient();
  const segmentDbClient = buildSegmentDbClient();
  const linesProvider = new HighwayLinesProvider(osmDbClient);

  const batchProcessor = new BatchProcessor<ISegment>(
    batchSize,
    (segments: Array<ISegment>) => segmentDbClient.db.insert(segments).into('segment'),
  );

  let i = 0;
  // eslint-disable-next-line no-restricted-syntax
  for await (const line of linesProvider.getLines()) {
    const lineSegments = convertOsmLineToSegments(line, segmentDbClient.st);

    await batchProcessor.process(lineSegments);

    output.log(`Line ${i}(id ${line.osm_id}) splitted into ${lineSegments.length} parts.`);

    i += 1;
  }

  await batchProcessor.finalize();
}
