import { Nullable } from '@common';
import { UserEntity } from './helper/user.data.model';
import { prisma } from '@lib/provider/database/prisma/prisma.service';
import { mapUserEntity } from './helper/user.data.util';

export const findUserById = async (
  id: string
): Promise<Nullable<UserEntity>> => {
  return mapUserEntity(
    await prisma.user.findUnique({
      where: {
        id: id,
      },
    })
  ) as Nullable<UserEntity>;
};

export const findUserByEmail = async (
  email: string
): Promise<Nullable<UserEntity>> => {
  return mapUserEntity(
    await prisma.user.findUnique({
      where: {
        email: email,
      },
    })
  ) as Nullable<UserEntity>;
};

export const createUser = async (
  email: string,
  firstName: Nullable<string>,
  lastName: Nullable<string>
): Promise<UserEntity> => {
  const currentDate = new Date();

  return mapUserEntity(
    await prisma.user.create({
      data: {
        email: email,
        firstName: firstName,
        lastName: lastName,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
    })
  ) as UserEntity;
};

export const updateUser = async (
  userId: string,
  firstName?: Nullable<string>,
  lastName?: Nullable<string>
): Promise<UserEntity> => {
  return mapUserEntity(
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        firstName: firstName,
        lastName: lastName,
        updatedAt: new Date(),
      },
    })
  ) as UserEntity;
};
