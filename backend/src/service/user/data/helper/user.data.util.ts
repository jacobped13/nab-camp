import { DataMapper, Nullable } from '@common';
import { User } from '@prisma/client';
import { UserEntity } from './user.data.model';

// -----------------------------------------------------------------
// User Entity Mapper
// -----------------------------------------------------------------

class UserEntityMapper extends DataMapper<User, UserEntity> {
  override mapInputObject(source: User): UserEntity {
    return new UserEntity(
      source.id,
      source.email,
      source.firstName,
      source.lastName,
      source.createdAt,
      source.updatedAt
    );
  }
}

const userEntityMapper = new UserEntityMapper();

/**
 * Maps an ORM user record to a normalized {@link UserEntity}.
 */
export const mapUserEntity = (user: Nullable<User> | User[]) => {
  return userEntityMapper.map(user);
};
