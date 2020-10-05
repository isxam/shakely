import { IDatabaseClient } from '../database';
import { ILayer } from './model/ILayer';

export default class LayerManagement {
  constructor(private readonly client: IDatabaseClient) {}

  public async create(layer: ILayer): Promise<void> {
    await this.client.db.insert(layer).into('layer');
  }
}
