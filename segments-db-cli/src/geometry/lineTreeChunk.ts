import { LineString, Units } from '@turf/turf';
import lineEqualChunk from './lineEqualChunk';

export interface IRootTree {
  geometry: LineString,
  children: Array<ISegmentTree>
}

export interface ISegmentTree extends IRootTree {
  level: number;
}

/**
 * Split line to tree-like chunks by length.
 */
export default function lineTreeChunk(
  line: LineString,
  levels: Array<number>,
  units: Units,
): IRootTree {
  const sortedLevels = levels.slice().sort((a: number, b: number) => b - a);

  const segmentsByLevel = new Map<number, Array<ISegmentTree>>();
  const rootSegmentTree: ISegmentTree = {
    level: 0,
    geometry: line,
    children: [],
  };

  sortedLevels.forEach((level: number, i: number) => {
    const segmentsToSplit = segmentsByLevel.get(sortedLevels[i - 1]) || [rootSegmentTree];
    segmentsByLevel.set(level, []);

    segmentsToSplit.forEach((segment: ISegmentTree) => {
      const subSegmentsGeometries = lineEqualChunk(segment.geometry, level, units);
      const segmentTrees = subSegmentsGeometries.map<ISegmentTree>(
        (geometry: LineString) => <ISegmentTree> {
          level,
          geometry,
          children: [],
        },
      );

      // eslint-disable-next-line no-param-reassign
      segment.children = segmentTrees;
      segmentsByLevel.set(
        level,
        segmentsByLevel.get(level).concat(segmentTrees),
      );
    });
  });

  return rootSegmentTree;
}
