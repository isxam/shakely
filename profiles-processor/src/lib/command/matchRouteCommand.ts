import OSRM from 'osrm-client-js';
import { FeatureCollection } from '@turf/turf';
import IProfile from '../profile/IProfile';
import buildOsrmClient from '../osrm/ClientBuilder';
import matchTrack from '../osrm/matchTrack';
import IProfileLocationRow from '../profile/IProfileLocationRow';
import { TrackFeature } from '../profile/TrackFeature';

/**
 * Build track GeoJSON.
 *
 * @param {Array} locationItems
 * @return {Object}
 */
function buildTrackGeoJson(locationItems: Array<IProfileLocationRow>): TrackFeature {
  const coordinates = locationItems.map((item) => [item.point.lon, item.point.lat]);
  const timestamps = locationItems.map((item) => Math.round(item.time / 1000));
  const radiuses = locationItems.map((item) => item.accuracy);

  return <TrackFeature>{
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates,
    },
    properties: {
      timestamps,
      radiuses,
    },
  };
}

export default async function execute(profile: IProfile): Promise<FeatureCollection> {
  profile.location.sort((a, b) => a.time - b.time);

  let previousLocationTime = 0;
  const minimizedLocations = profile.location.filter((l) => {
    const isValid = l.time - previousLocationTime >= 2000;

    if (isValid) {
      previousLocationTime = l.time;
    }

    return isValid;
  });

  const trackGeoJson = buildTrackGeoJson(minimizedLocations);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const osrmClient: OSRM = buildOsrmClient();
  return matchTrack(osrmClient, trackGeoJson);
}
