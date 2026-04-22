import { type SendEmailAuthenticationCodeResponseBody } from "@shared/api-contracts/authentication";
import { type User, type UserCredential } from "firebase/auth";

type SendCodeResponse = SendEmailAuthenticationCodeResponseBody | undefined;

export type AuthContextType = {
  _loading: boolean;
  authUser: User | null;
  sendEmailCode: (email: string) => Promise<SendCodeResponse>;
  resendEmailCode: (email: string) => Promise<void>;
  acceptEmailCode: (email: string, code: string) => Promise<void>;
  loginWithGoogle: () => Promise<UserCredential>;
  logout: () => Promise<void>;
};
