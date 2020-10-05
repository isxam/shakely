import { Feature, LineString } from 'geojson';

export type TrackFeatureProperties = {
  timestamps: number[]
  radiuses: number[]
};

export type TrackFeature = Feature<LineString, TrackFeatureProperties>;
