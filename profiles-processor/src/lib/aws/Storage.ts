import AWS from 'aws-sdk';

/**
 * Class to work with temp data-files, stored in AWS.S3.
 * Used as temp-storage to share large files between step-machine steps.
 */
export default class Storage {
  /**
   * Bucket to store files.
   *
   * @private
   */
  private readonly bucket: string;

  /**
   * Directory to store files.
   *
   * @private
   */
  private readonly dir: string;

  constructor(bucket: string, dir: string) {
    this.bucket = bucket;
    this.dir = dir;
  }

  /**
   * Save file.
   */
  async save(filename: string, data: unknown): Promise<void> {
    const s3 = new AWS.S3();

    const fileName = `${this.dir}/${filename}`;
    const request = {
      Bucket: this.bucket,
      Key: fileName,
      Body: JSON.stringify(data),
    };

    await s3.putObject(request).promise();
  }

  /**
   * Read file.
   */
  async read(filename: string): Promise<unknown> {
    const s3 = new AWS.S3();

    const fileName = `${this.dir}/${filename}`;
    const request = {
      Bucket: this.bucket,
      Key: fileName,
    };
    const object = await s3.getObject(request).promise();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(object.Body.toString());
  }
}
