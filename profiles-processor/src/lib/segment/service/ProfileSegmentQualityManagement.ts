import { IDatabaseClient } from '../../db';

export interface IProfileSegmentQuality {
  profile_id: string
  segment_id: string
  quality: number
}

export default class ProfileSegmentQualityManagement {
  private readonly client: IDatabaseClient;

  constructor(client: IDatabaseClient) {
    this.client = client;
  }

  async create(profileSegmentQuality: IProfileSegmentQuality): Promise<void> {
    const { db } = this.client;

    await db.insert(profileSegmentQuality).into('profile_segment_quality');
  }

  async bulkCreate(profileSegmentQualityItems: IProfileSegmentQuality[]): Promise<void> {
    const { db } = this.client;

    await db.insert(profileSegmentQualityItems).into('profile_segment_quality');
  }
}
