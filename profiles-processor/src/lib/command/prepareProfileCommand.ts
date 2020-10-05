import stream from 'stream';
import read from '../profile/reader';
import IProfile from '../profile/IProfile';

export default async function execute(dataStream: stream.Readable): Promise<IProfile> {
  return read(dataStream);
}
