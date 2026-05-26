export abstract class Entity<TId> {
  protected readonly _id: TId;
  protected readonly _createdAt: Date;
  protected _updatedAt: Date;
  protected _deletedAt?: Date;

  constructor(id: TId, createdAt?: Date, updatedAt?: Date, deletedAt?: Date) {
    this._id = id;
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || new Date();
    this._deletedAt = deletedAt;
  }

  get id(): TId {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get deletedAt(): Date | undefined {
    return this._deletedAt;
  }

  protected markAsUpdated(): void {
    this._updatedAt = new Date();
  }

  protected markAsDeleted(): void {
    this._deletedAt = new Date();
    this.markAsUpdated();
  }
}
