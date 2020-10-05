import {
  FIELD_COMMAND,
  COMMAND_SYNC,
  COMMAND_SENSOR,
  SYNC_FIELD_REAL_TIME,
  SYNC_FIELD_DEVICE_TIME,
  SENSOR_FIELD_TIME,
} from '../inputFileFormat';

/**
 * Synchronize device time with mobile app time.
 */
export default function sync(rows: Array<Array<string>>): Array<Array<string>> {
  const synchronizedRows: Array<Array<string>> = [];
  let dt = 0;

  rows.forEach((row) => {
    const command = row[FIELD_COMMAND];

    if (command === COMMAND_SYNC) {
      const rowRealTime = parseInt(row[SYNC_FIELD_REAL_TIME], 10);
      const rowDeviceTime = parseInt(row[SYNC_FIELD_DEVICE_TIME], 10);
      dt = rowRealTime - rowDeviceTime;
    }

    if (command === COMMAND_SENSOR) {
      const rowDeviceTime = parseInt(row[SENSOR_FIELD_TIME], 10);
      // eslint-disable-next-line no-param-reassign
      row[SENSOR_FIELD_TIME] = (rowDeviceTime + dt).toString();
    }

    if (dt !== 0 && command !== COMMAND_SYNC) {
      synchronizedRows.push(row);
    }
  });

  return synchronizedRows;
}
