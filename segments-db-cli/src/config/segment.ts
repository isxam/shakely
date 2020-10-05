import config from 'config';

// eslint-disable-next-line import/prefer-default-export
export function getLevels(): Array<number> {
  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  return config.get('segment.levels') as Array<number>;
}
