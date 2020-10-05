import {
  LineString,
  Units,
  length,
  lineChunk,
} from '@turf/turf';

/**
 * Precision value to fix errors with last additional chunk.
 */
const precision = 0.0001;

/**
 * Split line to chunks with equal length.
 */
export default function lineEqualChunk(
  line: LineString,
  chunkLength: number,
  units: Units,
): Array<LineString> {
  const lineLength = length(line, { units });
  const segmentsCount = Math.ceil(lineLength / chunkLength);
  const segmentLength = lineLength / segmentsCount + precision;

  const collection = lineChunk(line, segmentLength, { units });

  return collection.features.map((feature) => feature.geometry);
}
