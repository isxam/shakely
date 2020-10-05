import { IDatabaseClient } from '../../db';

interface IProfile {
  id: string
  name: string
}

export default class ProfileManagement {
  private readonly client: IDatabaseClient;

  constructor(client: IDatabaseClient) {
    this.client = client;
  }

  async create(profile: IProfile): Promise<void> {
    const { db } = this.client;

    await db.insert(profile).into('profile');
  }
}
