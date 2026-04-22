import { Nullable } from '@common';

/**
 * Represents a user entity in the system.
 */
export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly firstName: Nullable<string>,
    public readonly lastName: Nullable<string>,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
