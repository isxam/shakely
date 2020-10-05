export default class BatchProcessor<T> {
  private batchItems: Array<T> = [];

  constructor(
    private readonly batchSize: number,
    private readonly batchCallback: (items: Array<T>) => Promise<void>,
  ) {}

  public async process(items: Array<T>): Promise<void> {
    this.batchItems = this.batchItems.concat(items);

    if (this.batchItems.length >= this.batchSize) {
      await this.finalize();
    }
  }

  public async finalize(): Promise<void> {
    await this.batchCallback(this.batchItems);
    this.batchItems = [];
  }
}
