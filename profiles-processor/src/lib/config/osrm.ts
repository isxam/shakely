import config from 'config';

export function getOsrmUrl(): string {
  // eslint-disable-next-line max-len
  // eslint-disable-next-line max-len,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
  return config.get('osrm.url') as string;
}
