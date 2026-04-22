import { DataMapper, Nullable } from '@common';
import { UserEntity } from '@service/user';
import { User as UserResponse } from '@api-contracts/user';

// -----------------------------------------------------------------
// User Response Mapper
// -----------------------------------------------------------------

class UserResponseMapper extends DataMapper<UserEntity, UserResponse> {
  override mapInputObject(source: UserEntity): UserResponse {
    return {
      id: source.id,
      email: source.email,
      firstName: source.firstName ?? '',
      lastName: source.lastName ?? '',
      createdAt: source.createdAt.getTime(),
      updatedAt: source.createdAt.getTime(),
    };
  }
}

const userResponseMapper = new UserResponseMapper();

/**
 * Maps a user entity to an API {@link UserResponse}.
 */
export const mapUserResponse = (user: Nullable<UserEntity> | UserEntity[]) => {
  return userResponseMapper.map(user);
};
