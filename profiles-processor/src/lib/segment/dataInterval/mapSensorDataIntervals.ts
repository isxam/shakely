import IProfileSensorRow from '../../profile/IProfileSensorRow';
import { SegmentsSensorData } from './types';
import { SegmentsIntervals } from '../timeInterval';

/**
 * Get sensor data by interval.
 */
function getSensorDataByInterval(
  sensorData: IProfileSensorRow[],
  from: number,
  to: number,
): IProfileSensorRow[] {
  return sensorData.filter((item) => item.time > from && item.time < to);
}

/**
 * Map sensor data to segments.
 */
export function mapSensorDataIntervals(
  segments: SegmentsIntervals,
  sensorData: IProfileSensorRow[],
): SegmentsSensorData {
  const segmentsSensorData: SegmentsSensorData = {};

  const segmentIds = Object.keys(segments);
  segmentIds.forEach((segmentId) => {
    segmentsSensorData[segmentId] = [];
    segments[segmentId].forEach((interval) => {
      const from = Math.min(...interval);
      const to = Math.max(...interval);
      const intervalSensorData = getSensorDataByInterval(sensorData, from, to);

      segmentsSensorData[segmentId].push(intervalSensorData);
    });
  });

  return segmentsSensorData;
}
