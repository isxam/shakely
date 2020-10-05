import OSRM from 'osrm-client-js';
import { getOsrmUrl } from '../config/osrm';

function fixOsrmClientOptionsIssue(client: OSRM): void {
  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,no-underscore-dangle,no-param-reassign
  client._stringifyOptionsArray = (array: Array<string>) => array.map(
    // eslint-disable-next-line no-mixed-operators
    (value) => (value === null && '' || value),
  ).join(';');
}

/**
 * Builds OSRM client.
 */
export default function build(): OSRM {
  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
  const client = new OSRM({
    url: getOsrmUrl(),
    profile: 'bike',
    timeout: 30000,
  });

  fixOsrmClientOptionsIssue(client);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return client;
}
