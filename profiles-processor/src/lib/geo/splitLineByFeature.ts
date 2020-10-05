import {
  featureCollection,
  lineSplit,
  lineIntersect,
  Point,
  Feature,
  FeatureCollection,
  LineString,
  Polygon,
  MultiPolygon,
} from '@turf/turf';

/**
 * Split lines by point.
 *
 * @param {Array} lines
 * @param {Object} point
 * @return {Array}
 */
function splitLinesByPoint(
  lines: Feature<LineString>[],
  point: Feature<Point>,
): Feature<LineString>[] {
  let resultParts: Feature<LineString>[] = [];

  lines.forEach((line) => {
    const parts = lineSplit(line, point);
    resultParts = resultParts.concat(parts.features);
  });

  return resultParts;
}

/**
 * Split line by feature.
 */
export default function splitLineByFeature(
  line: Feature<LineString>,
  feature: Feature<Polygon|MultiPolygon>,
): FeatureCollection<LineString> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const points = lineIntersect(line, feature);

  let resultParts: Feature<LineString>[] = [line];
  points.features.forEach((point) => {
    resultParts = splitLinesByPoint(resultParts, point);
  });

  return featureCollection(resultParts);
}
