import { SegmentsQuality } from './types';
import { SegmentsSensorData } from '../dataInterval';
import IProfileSensorRow from '../../profile/IProfileSensorRow';

const MAX_ACCELEROMETER_DELTA = 320;

function calculateSegmentQuality(sensorData: IProfileSensorRow[]) {
  const accelerometerValues = sensorData.map((item) => item.accelerometer.z);
  const min = Math.min(...accelerometerValues);
  const max = Math.max(...accelerometerValues);

  const delta = max - min;
  const normalizedDelta = Math.min(Math.max(delta, 0), MAX_ACCELEROMETER_DELTA)
    / MAX_ACCELEROMETER_DELTA;

  const quality = 1 - normalizedDelta;

  return Math.round(quality * 5);
}

/**
 * Map sensor data to segments.
 */
export function mapSegmentsQuality(
  segmentsSensorData: SegmentsSensorData,
): SegmentsQuality {
  const segmentsQuality: SegmentsQuality = {};

  const segmentIds = Object.keys(segmentsSensorData);
  segmentIds.forEach((segmentId) => {
    segmentsQuality[segmentId] = calculateSegmentQuality(segmentsSensorData[segmentId][0]);
  });

  return segmentsQuality;
}
