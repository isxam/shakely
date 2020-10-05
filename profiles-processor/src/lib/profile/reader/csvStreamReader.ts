import * as stream from 'stream';
import { parseStream } from 'fast-csv';

/**
 * Read rows from stream.
 *
 * @param readStream
 * @return {Promise}
 */
export default async function read(readStream: stream.Readable): Promise<Array<Array<string>>> {
  return new Promise((resolve, reject) => {
    const items = [];

    parseStream(readStream)
      .on('error', (error) => {
        reject(error);
      })
      .on('data', (row) => {
        items.push(row);
      })
      .on('end', () => {
        resolve(items);
      });
  });
}
