import {
  Feature,
  LineString,
  Polygon,
  MultiPolygon,
  buffer,
  booleanContains,
  length,
  distance,
  coordAll,
  segmentEach,
  featureEach,
  pointToLineDistance,
} from '@turf/turf';
import splitLineByFeature from '../../geo/splitLineByFeature';
import { TimeInterval, SegmentsIntervals } from './types';

/**
 * Filter segments by feature.
 */
function filterSegmentsByFeature(feature: Feature, segmentsFeatures: Feature[]): Feature[] {
  const featureBuffered = buffer(feature, 1, { units: 'meters' });

  return segmentsFeatures.filter(
    (segmentFeature) => booleanContains(featureBuffered, segmentFeature),
  );
}

/**
 * Get point position on line.
 */
function getPointPosition(line, point) {
  const lineDistance = length(line);
  const distanceToPoint = distance(
    coordAll(line)[0],
    point,
  );

  return distance ? distanceToPoint / lineDistance : 0;
}

/**
 * Get point time.
 */
function getPointTime(point: number[], track: Feature<LineString, {timestamps: number[]}>): number {
  let time: number = null;

  segmentEach(
    track,
    (
      currentSegment,
      featureIndex,
      multiFeatureIndex,
      geometryIndex,
      segmentIndex,
    ) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const isOnLine = pointToLineDistance(point, currentSegment) < 0.00001;

      if (isOnLine) {
        const position = getPointPosition(currentSegment, point);
        const segmentStartTime = track.properties.timestamps[segmentIndex];
        const segmentEndTime = track.properties.timestamps[segmentIndex + 1];

        time = segmentStartTime + position * (segmentEndTime - segmentStartTime);
      }
    },
  );

  return time;
}

/**
 * Get time by segment.
 */
function getTimeByTrackPart(
  track: Feature<LineString, {timestamps: number[]}>,
  part: Feature<LineString>,
): TimeInterval {
  const coordinates = coordAll(part);

  const from = coordinates[0];
  const to = coordinates[coordinates.length - 1];

  const fromTime = Math.ceil(getPointTime(from, track) * 1000);
  const toTime = Math.ceil(getPointTime(to, track) * 1000);

  return [fromTime, toTime];
}

/**
 * Find time by segment.
 */
function findTimeBySegment(
  segment: Feature<Polygon|MultiPolygon>,
  track: Feature<LineString, {timestamps: number[]}>,
): TimeInterval[] {
  const parts = splitLineByFeature(track, segment);

  const intervals: TimeInterval[] = [];

  const bufferedSegment = buffer(segment, 0.01, { units: 'meters' });

  featureEach(parts, (part) => {
    if (!booleanContains(bufferedSegment, part)) {
      return;
    }

    intervals.push(getTimeByTrackPart(track, part));
  });

  return intervals;
}

/**
 * Map time intervals to segments.
 */
export function mapSegmentIntervals(
  trackFeature: Feature<LineString, {timestamps: number[]}>,
  segmentsFeatures: Feature<LineString, {segment_id: number}>[],
): SegmentsIntervals {
  const filteredSegmentsFeatures = filterSegmentsByFeature(trackFeature, segmentsFeatures);
  const bufferedSegmentsFeatures = filteredSegmentsFeatures.map(
    (segment) => buffer(segment, 2, { units: 'meters' }),
  );

  const segmentsIntervals = {};
  bufferedSegmentsFeatures.forEach((segment) => {
    const intervals = findTimeBySegment(segment, trackFeature);

    if (intervals.length) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      segmentsIntervals[segment.properties.segment_id] = intervals;
    }
  });

  return segmentsIntervals;
}
