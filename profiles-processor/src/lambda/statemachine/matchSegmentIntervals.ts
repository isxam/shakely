import { FeatureCollection } from 'geojson';
import { IEventSearchSegmentOutput } from './searchSegments';
import buildOutputStorage from '../../lib/aws/buildOutputStorage';
import filenameGenerator from '../../lib/aws/filenameGenerator';
import matchSegmentIntervalsCommand from '../../lib/command/matchSegmentIntervalsCommand';

export interface IEventMatchSegmentOutput extends IEventSearchSegmentOutput {
  intervals: string,
}

export async function execute(
  event: IEventSearchSegmentOutput,
): Promise<IEventMatchSegmentOutput> {
  const storage = buildOutputStorage();

  const segments = await storage.read(event.segments) as FeatureCollection;
  const matched = await storage.read(event.matched) as FeatureCollection;

  const intervals = matchSegmentIntervalsCommand(segments, matched);

  const intervalsFilename = filenameGenerator();
  await storage.save(intervalsFilename, intervals);

  return <IEventMatchSegmentOutput>{
    ...event,
    intervals: intervalsFilename,
  };
}
