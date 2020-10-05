import { FeatureCollection } from 'geojson';
import { SegmentsIntervals, mapSegmentIntervals } from '../segment/timeInterval';

export default function execute(
  segments: FeatureCollection,
  matchedRoute: FeatureCollection,
): SegmentsIntervals {
  const segmentsFeatures = segments.features;
  const segmentsIntervals: SegmentsIntervals = {};

  matchedRoute.features.forEach((trackFeature) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line max-len
    const featureSegmentsIntervals: SegmentsIntervals = mapSegmentIntervals(trackFeature, segmentsFeatures);

    const segmentIds = Object.keys(featureSegmentsIntervals);
    segmentIds.forEach((segmentId) => {
      segmentsIntervals[segmentId] = segmentsIntervals[segmentId] || [];
      segmentsIntervals[segmentId] = segmentsIntervals[segmentId]
        .concat(featureSegmentsIntervals[segmentId]);
    });
  });

  return segmentsIntervals;
}
