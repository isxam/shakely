import * as stream from 'stream';
import csvStreamRead from './reader/csvStreamReader';
import locationDataExtract from './reader/locationDataExtract';
import sensorDataExtract from './reader/sensorDataExtract';
import syncSensorTime from './reader/syncSensorTime';
import IProfile from './IProfile';

/**
 * Format profile data.
 */
function formatProfileData(rows: Array<Array<string>>): IProfile {
  return {
    location: locationDataExtract(rows),
    sensor: sensorDataExtract(rows),
  };
}

/**
 * Read profile data.
 */
export default async function execute(dataStream: stream.Readable): Promise<IProfile> {
  const rows = await csvStreamRead(dataStream);
  const synchronizedRows = syncSensorTime(rows);

  return formatProfileData(synchronizedRows);
}
