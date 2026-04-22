import { PERSISTED_LOCAL_STORAGE_KEYS } from "@/lib/consts/local-storage-keys";

// This function sets the invite code in local storage to be able to test
// the invite flow in development mode.
export const setInviteCodeKey = (code: string | undefined): void => {
  if (code && import.meta.env.DEV) {
    localStorage.setItem(
      PERSISTED_LOCAL_STORAGE_KEYS.DEVELOPMENT_INVITE_ID,
      code,
    );
  }
};
