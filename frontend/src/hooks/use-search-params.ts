import { useCallback, useMemo } from "react";
import { useSearchParams as useReactRouterSearchParams } from "react-router-dom";

export type SearchParams = Record<SearchParamsKeys, string>;

export enum SearchParamsKeys {
  // used to populate the authed email in login when
  // the user clicks the email link
  Email = "email",

  // used to auto populate the code field during sign in
  // from the email link
  Code = "code",

  // used to track the invite id from an email link
  // this query param existing will force the user to accept or reject the invite
  InviteId = "inviteId",

  // used to track the selected plan during registration
  // and persist it through the stripe redirect
  PlanId = "planId",

  // used to track the session id from a stripe checkout session
  // this query param existing will force the user to register a payment method
  SessionId = "sessionId",
}

export const SEARCH_PARAM_MAPPING = {
  [SearchParamsKeys.Email]: {
    key: "email",
    defaultValue: "",
  },
  [SearchParamsKeys.Code]: {
    key: "code",
    defaultValue: "",
  },
  [SearchParamsKeys.InviteId]: {
    key: "invite_id",
    defaultValue: "",
  },
  [SearchParamsKeys.PlanId]: {
    key: "plan_id",
    defaultValue: "",
  },
  [SearchParamsKeys.SessionId]: {
    key: "session_id",
    defaultValue: "",
  },
};

export const useSearchParams = () => {
  const [searchParams, setSearchParams] = useReactRouterSearchParams();

  const searchParamValue = useCallback(
    (key: SearchParamsKeys): string => {
      const mappedKey = SEARCH_PARAM_MAPPING[key].key;
      return (
        searchParams.get(mappedKey) ?? SEARCH_PARAM_MAPPING[key].defaultValue
      );
    },
    [searchParams],
  );

  const values = useMemo(
    (): SearchParams => ({
      [SearchParamsKeys.Email]: searchParamValue(SearchParamsKeys.Email),
      [SearchParamsKeys.Code]: searchParamValue(SearchParamsKeys.Code),
      [SearchParamsKeys.InviteId]: searchParamValue(SearchParamsKeys.InviteId),
      [SearchParamsKeys.PlanId]: searchParamValue(SearchParamsKeys.PlanId),
      [SearchParamsKeys.SessionId]: searchParamValue(
        SearchParamsKeys.SessionId,
      ),
    }),
    [searchParamValue],
  );

  const set = useCallback(
    (key: SearchParamsKeys, value: string): URLSearchParams => {
      const updatedSearchParams = new URLSearchParams(searchParams.toString());
      const mappedKey = SEARCH_PARAM_MAPPING[key].key;
      updatedSearchParams.set(mappedKey, value);
      setSearchParams(updatedSearchParams);
      return updatedSearchParams;
    },
    [searchParams, setSearchParams],
  );

  const remove = useCallback(
    (key: SearchParamsKeys): URLSearchParams => {
      const updatedSearchParams = new URLSearchParams(searchParams.toString());
      const mappedKey = SEARCH_PARAM_MAPPING[key].key;
      updatedSearchParams.delete(mappedKey);
      setSearchParams(updatedSearchParams);
      return updatedSearchParams;
    },
    [searchParams, setSearchParams],
  );

  const removeAll = useCallback((): URLSearchParams => {
    const updatedSearchParams = new URLSearchParams(searchParams.toString());
    for (const [key] of updatedSearchParams.entries()) {
      updatedSearchParams.delete(key);
    }

    setSearchParams(updatedSearchParams);
    return updatedSearchParams;
  }, [searchParams, setSearchParams]);

  return {
    values,
    set,
    remove,
    removeAll,
    searchParams,
    setSearchParams,
  };
};
