import { v4 as uuidv4 } from 'uuid';
import IProfile from '../profile/IProfile';
import ProfileManagement from '../segment/service/ProfileManagement';
import ProfileSegmentQualityManagement, { IProfileSegmentQuality } from '../segment/service/ProfileSegmentQualityManagement';
import buildClient from '../segment/db';
import { mapSensorDataIntervals } from '../segment/dataInterval';
import { SegmentsQuality, mapSegmentsQuality } from '../segment/quality';
import { SegmentsIntervals } from '../segment/timeInterval';

function mapSegmentQualityToItems(
  profileId: string,
  segmentsQuality: SegmentsQuality,
): IProfileSegmentQuality[] {
  const segmentIds = Object.keys(segmentsQuality);

  return segmentIds.map((segmentId) => ({
    profile_id: profileId,
    segment_id: segmentId,
    quality: segmentsQuality[segmentId],
  }));
}

export default async function execute(
  profile: IProfile,
  intervals: SegmentsIntervals,
): Promise<void> {
  const segmentsSensorData = mapSensorDataIntervals(intervals, profile.sensor);
  const segmentsQuality = mapSegmentsQuality(segmentsSensorData);

  const client = buildClient();
  const profileManagement = new ProfileManagement(client);
  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
  const profileUid: string = uuidv4();
  await profileManagement.create({
    id: profileUid,
    name: profileUid,
  });

  const profileSegmentQualityManagement = new ProfileSegmentQualityManagement(client);

  await profileSegmentQualityManagement.bulkCreate(
    mapSegmentQualityToItems(profileUid, segmentsQuality),
  );
}
