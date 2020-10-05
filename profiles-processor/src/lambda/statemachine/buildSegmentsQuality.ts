import { IEventMatchSegmentOutput } from './matchSegmentIntervals';
import buildOutputStorage from '../../lib/aws/buildOutputStorage';
import IProfile from '../../lib/profile/IProfile';
import buildSegmentsQualityCommand from '../../lib/command/buildSegmentsQualityCommand';
import { SegmentsIntervals } from '../../lib/segment/timeInterval';

export async function execute(
  event: IEventMatchSegmentOutput,
): Promise<IEventMatchSegmentOutput> {
  const storage = buildOutputStorage();

  const profile = await storage.read(event.profile) as IProfile;
  const intervals = await storage.read(event.intervals) as SegmentsIntervals;

  await buildSegmentsQualityCommand(profile, intervals);

  return event;
}
