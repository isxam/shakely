import config from 'config';

export function getOutputBucket(): string {
  // eslint-disable-next-line max-len
  // eslint-disable-next-line max-len,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
  return config.get('aws.output.bucket') as string;
}

export function getOutputDir(): string {
  // eslint-disable-next-line max-len
  // eslint-disable-next-line max-len,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
  return config.get('aws.output.dir') as string;
}
