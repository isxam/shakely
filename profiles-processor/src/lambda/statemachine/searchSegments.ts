import { FeatureCollection } from 'geojson';
import { IEventMatchRouteOutput } from './matchRoute';
import buildOutputStorage from '../../lib/aws/buildOutputStorage';
import filenameGenerator from '../../lib/aws/filenameGenerator';
import searchSegmentsCommand from '../../lib/command/searchSegmentsCommand';

export interface IEventSearchSegmentOutput extends IEventMatchRouteOutput {
  segments: string,
}

export async function execute(event: IEventMatchRouteOutput): Promise<IEventSearchSegmentOutput> {
  const storage = buildOutputStorage();
  const matchedTrack = await storage.read(event.matched) as FeatureCollection;

  const segments = await searchSegmentsCommand(matchedTrack);

  const segmentsFilename = filenameGenerator();
  await storage.save(segmentsFilename, segments);

  return <IEventSearchSegmentOutput>{
    ...event,
    segments: segmentsFilename,
  };
}
