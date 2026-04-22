// local storage keys that persist past logout
export const PERSISTED_LOCAL_STORAGE_KEYS = {
  DEVELOPMENT_INVITE_ID: "development-invite-id",
};

// local storage keys that are cleared on logout
export const SESSION_LOCAL_STORAGE_KEYS = {};

// All local storage keys used in the application
export const ALL_LOCAL_STORAGE_KEYS = {
  ...PERSISTED_LOCAL_STORAGE_KEYS,
  ...SESSION_LOCAL_STORAGE_KEYS,
};

export const clearLocalStorageSegment = (keys: Record<string, string>) => {
  for (const key of Object.values(keys)) {
    localStorage.removeItem(key);
  }
};
