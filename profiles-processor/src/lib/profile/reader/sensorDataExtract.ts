import IProfileSensorRow from '../IProfileSensorRow';
import {
  COMMAND_SENSOR,
  FIELD_COMMAND,
  SENSOR_FIELD_TIME,
  SENSOR_FIELD_ACCELEROMETER_Z,
  SENSOR_FIELD_SPEED,
} from '../inputFileFormat';

/**
 * Extract sensor rows from data.
 */
export default function extract(rows: Array<Array<string>>): Array<IProfileSensorRow> {
  const sensorRows = rows.filter((row) => row[FIELD_COMMAND] === COMMAND_SENSOR);

  return sensorRows.map((row) => (<IProfileSensorRow>{
    time: parseInt(row[SENSOR_FIELD_TIME], 10),
    accelerometer: {
      z: parseFloat(row[SENSOR_FIELD_ACCELEROMETER_Z]),
    },
    speed: parseFloat(row[SENSOR_FIELD_SPEED]),
  }));
}
