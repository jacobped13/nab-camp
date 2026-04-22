import {
  type CreateUserRequestBody,
  type CreateUserResponseBody,
  type UpdateUserRequestBody,
  type UpdateUserRequestParam,
  type UpdateUserResponseBody,
} from "@shared/api-contracts/user";
import { useMutation } from "@tanstack/react-query";

import { mutate } from "@/network/base";

const USER_MUTATION_KEYS = {
  CREATE: ["createUser"],
  UPDATE: ["updateUser"],
};

export const useUserMutations = () => {
  const create = useMutation({
    mutationKey: USER_MUTATION_KEYS.CREATE,
    mutationFn: (data: CreateUserRequestBody) =>
      mutate<CreateUserResponseBody, CreateUserRequestBody>("/user", {
        method: "POST",
        payload: data,
      }),
  });

  const update = useMutation({
    mutationKey: USER_MUTATION_KEYS.UPDATE,
    mutationFn: (data: UpdateUserRequestBody & UpdateUserRequestParam) =>
      mutate<UpdateUserResponseBody, UpdateUserRequestBody>(
        `/user/${data.id}`,
        {
          method: "PUT",
          payload: data,
        },
      ),
  });

  return { create, update };
};
