import { Geometry, Feature, FeatureCollection } from 'geojson';
import SegmentSearch from '../segment/service/SegmentSearch';
import buildClient from '../segment/db';

/**
 * Extract geometries from feature collection.
 */
function extractGeometries(collection: FeatureCollection): Geometry[] {
  const geometries: Geometry[] = [];

  collection.features.forEach((feature: Feature) => {
    if (feature.geometry) {
      geometries.push(feature.geometry);
    }
  });

  return geometries;
}

/**
 * Search segments by track command.
 */
export default async function execute(matchedRoute: FeatureCollection): Promise<FeatureCollection> {
  const client = buildClient();
  const segmentSearch = new SegmentSearch(client);

  const geometries = extractGeometries(matchedRoute);

  let features = [];
  for (let i = 0; i < geometries.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const segmentsGeoJson = await segmentSearch.searchByGeometry(
      geometries[i],
      4,
    );

    features = features.concat(segmentsGeoJson.features);
  }

  return <FeatureCollection>{
    type: 'FeatureCollection',
    features,
  };
}
