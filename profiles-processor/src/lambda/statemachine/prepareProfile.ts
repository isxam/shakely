import AWS from 'aws-sdk';
import prepareProfile from '../../lib/command/prepareProfileCommand';
import buildOutputStorage from '../../lib/aws/buildOutputStorage';
import filenameGenerator from '../../lib/aws/filenameGenerator';

interface IEventInput {
  dataFile: {
    Bucket: string
    Key: string
  }
}

export interface IEventPrepareProfileOutput extends IEventInput {
  profile: string
}

export async function execute(event: IEventInput): Promise<IEventPrepareProfileOutput> {
  const s3 = new AWS.S3();
  const stream = s3.getObject(event.dataFile).createReadStream();

  const data = await prepareProfile(stream);

  const filename = filenameGenerator();
  await buildOutputStorage().save(filename, data);

  return <IEventPrepareProfileOutput>{
    ...event,
    profile: filename,
  };
}
