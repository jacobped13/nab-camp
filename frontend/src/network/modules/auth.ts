import {
  type AcceptEmailAuthenticationCodeRequestBody,
  type AcceptEmailAuthenticationCodeResponseBody,
  type SendEmailAuthenticationCodeRequestBody,
  type SendEmailAuthenticationCodeResponseBody,
} from "@shared/api-contracts/authentication";
import { useMutation } from "@tanstack/react-query";

import { mutate } from "@/network/base";

const AUTH_MUTATION_KEYS = {
  SEND_CODE: ["sendCode"],
  ACCEPT_CODE: ["acceptCode"],
};

export const useAuthMutations = () => {
  const sendCode = useMutation({
    mutationKey: AUTH_MUTATION_KEYS.SEND_CODE,
    mutationFn: (data: SendEmailAuthenticationCodeRequestBody) =>
      mutate<
        SendEmailAuthenticationCodeResponseBody,
        SendEmailAuthenticationCodeRequestBody
      >("/authentication/email/code/send", {
        method: "POST",
        payload: data,
        unauthenticatedRequest: true,
      }),
  });

  const acceptCode = useMutation({
    mutationKey: AUTH_MUTATION_KEYS.ACCEPT_CODE,
    mutationFn: (data: AcceptEmailAuthenticationCodeRequestBody) =>
      mutate<
        AcceptEmailAuthenticationCodeResponseBody,
        AcceptEmailAuthenticationCodeRequestBody
      >("/authentication/email/code/accept", {
        method: "POST",
        payload: data,
        unauthenticatedRequest: true,
      }),
  });

  return { sendCode, acceptCode };
};
