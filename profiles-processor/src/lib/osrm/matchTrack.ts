import OSRM from 'osrm-client-js';
import { FeatureCollection, Feature } from '@turf/turf';
import { TrackFeature } from '../profile/TrackFeature';
import { ILocation, IMatchingResult, ITracepointPosition } from './types';

const MAX_MATCH_SIZE = 1000;

/**
 * Call OSRM matching service.
 */
function osrmMatch(
  client: OSRM,
  coordinates: number[][],
  timestamps: number[],
  radiuses: number[],
): Promise<IMatchingResult> {
  const request = {
    coordinates,
    timestamps,
    radiuses,
    overview: 'full',
  };

  return new Promise((resolve, reject) => {
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    client.match(request, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

/**
 * Splits array to chunks.
 */
function splitArrayToChunks<T>(items: Array<T>, size: number): Array<Array<T>> {
  const chunks: Array<Array<T>> = [];

  const itemsCopy = items.concat([]);
  while (itemsCopy.length) {
    chunks.push(itemsCopy.splice(0, size));
  }

  return chunks;
}

/**
 * Match route.
 */
async function match(
  client: OSRM,
  coordinates: number[][],
  timestamps: number[],
  radiuses: number[],
): Promise<Array<ILocation>> {
  const result = await osrmMatch(client, coordinates, timestamps, radiuses);

  return result.tracepoints.map((tracepoint) => {
    if (tracepoint === null) {
      return null;
    }

    return tracepoint.location;
  });
}

/**
 * Group tracepoints by series of valid.
 */
function groupTracepoints(tracepoints: Array<Array<ILocation>>): Array<Array<ITracepointPosition>> {
  const tracepointsGroups: Array<Array<ITracepointPosition>> = [];
  let tracepointsGroup = [];

  tracepoints.forEach((tracepoint, i) => {
    if (tracepoint === null && tracepointsGroup.length === 0) {
      return;
    }

    if (tracepoint === null && tracepointsGroup.length > 0) {
      tracepointsGroups.push(tracepointsGroup);
      tracepointsGroup = [];

      return;
    }

    tracepointsGroup.push({
      tracepoint,
      position: i,
    });
  });

  if (tracepointsGroup.length > 0) {
    tracepointsGroups.push(tracepointsGroup);
  }

  return tracepointsGroups.filter((group) => group.length > 1);
}

/**
 * Build feature of tracepoints group.
 */
function buildTracepointsGroupFeature(
  tracepoints: Array<ITracepointPosition>,
  originTimestamps: number[],
): Feature {
  return {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: tracepoints.map((tracepoint) => tracepoint.tracepoint),
    },
    properties: {
      timestamps: tracepoints.map((tracepoint) => originTimestamps[tracepoint.position]),
    },
  };
}

/**
 * Build matched track GeoJSON.
 */
function buildMatchedTrackGeoJson(
  tracepointsGroups: Array<Array<ITracepointPosition>>,
  originTimestamps: number[],
): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: tracepointsGroups.map(
      (group) => buildTracepointsGroupFeature(group, originTimestamps),
    ),
  };
}

/**
 * Match profile track.
 *
 * @returns {Promise}
 */
export default async function execute(
  client: OSRM,
  trackGeoJson: TrackFeature,
): Promise<FeatureCollection> {
  const { coordinates } = trackGeoJson.geometry;
  const { timestamps, radiuses } = trackGeoJson.properties;

  const coordinatesChunks = splitArrayToChunks(coordinates, MAX_MATCH_SIZE);
  const timestampsChunks = splitArrayToChunks(timestamps, MAX_MATCH_SIZE);
  const radiusesChunks = splitArrayToChunks(radiuses, MAX_MATCH_SIZE);

  let tracepoints = [];
  for (let i = 0; i < coordinatesChunks.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const chunkTracepoints = await match(
      client,
      coordinatesChunks[i],
      timestampsChunks[i],
      radiusesChunks[i],
    );

    tracepoints = tracepoints.concat(chunkTracepoints);
  }

  const tracepointsGroups = groupTracepoints(tracepoints);

  return buildMatchedTrackGeoJson(tracepointsGroups, timestamps);
}
