import AWS from 'aws-sdk';

interface S3ObjectCreatedEventRecord {
  s3: {
    object: {
      key: string,
    },
    bucket: {
      name: string
    }
  }
}

interface S3ObjectCreatedEvent {
  Records: Array<S3ObjectCreatedEventRecord>
}

/**
 * Execute state machine on s3 object created.
 *
 * @returns {Promise<void>}
 */
export async function execute(event: S3ObjectCreatedEvent): Promise<void> {
  const profileProcessingStateMachineArn = process.env.PROFILE_PROCESSING_STATE_MACHINE_ARN;
  const stepFunctions = new AWS.StepFunctions();

  const eventRecord = event.Records[0];

  await stepFunctions.startExecution({
    stateMachineArn: profileProcessingStateMachineArn,
    input: JSON.stringify({
      dataFile: {
        Bucket: eventRecord.s3.bucket.name,
        Key: eventRecord.s3.object.key,
      },
    }),
  }).promise();
}
