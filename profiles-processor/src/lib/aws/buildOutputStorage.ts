import Storage from './Storage';
import { getOutputBucket, getOutputDir } from '../config/aws';

export default function buildOutputStorage(): Storage {
  return new Storage(
    getOutputBucket(),
    getOutputDir(),
  );
}
