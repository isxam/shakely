import { IEventPrepareProfileOutput } from './prepareProfile';
import buildOutputStorage from '../../lib/aws/buildOutputStorage';
import filenameGenerator from '../../lib/aws/filenameGenerator';
import matchRouteCommandExecute from '../../lib/command/matchRouteCommand';
import IProfile from '../../lib/profile/IProfile';

export interface IEventMatchRouteOutput extends IEventPrepareProfileOutput {
  matched: string
}

export async function execute(event: IEventPrepareProfileOutput): Promise<IEventMatchRouteOutput> {
  const storage = buildOutputStorage();
  const profile = await storage.read(event.profile) as IProfile;

  const matched = await matchRouteCommandExecute(profile);

  const matchedRouteFilename = filenameGenerator();
  await storage.save(matchedRouteFilename, matched);

  return <IEventMatchRouteOutput>{
    ...event,
    matched: matchedRouteFilename,
  };
}
