import IProfileLocationRow from '../IProfileLocationRow';
import {
  COMMAND_LOCATION,
  FIELD_COMMAND,
  LOCATION_FIELD_TIME,
  LOCATION_FIELD_LATITUDE,
  LOCATION_FIELD_LONGITUDE,
  LOCATION_FIELD_ACCURACY,
} from '../inputFileFormat';

/**
 * Extract location rows from data.
 */
export default function extract(rows: Array<Array<string>>): Array<IProfileLocationRow> {
  const locationRows = rows.filter((row) => row[FIELD_COMMAND] === COMMAND_LOCATION);

  return locationRows.map((row) => (<IProfileLocationRow>{
    time: parseInt(row[LOCATION_FIELD_TIME], 10),
    accuracy: parseFloat(row[LOCATION_FIELD_ACCURACY]),
    point: {
      lat: parseFloat(row[LOCATION_FIELD_LATITUDE]),
      lon: parseFloat(row[LOCATION_FIELD_LONGITUDE]),
    },
  }));
}
