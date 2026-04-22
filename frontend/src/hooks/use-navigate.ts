import { isBoolean } from "lodash-es";
import { useCallback } from "react";
import { useNavigate as useReactRouterNavigate } from "react-router-dom";

import { type Routes } from "@/app/routes/routes";
import {
  SEARCH_PARAM_MAPPING,
  type SearchParams,
  type SearchParamsKeys,
  useSearchParams,
} from "@/hooks/use-search-params";

export type NavigateArgs = {
  route: Routes | string;
  newParams?: Partial<SearchParams>;
  clearParams?: boolean | SearchParamsKeys[];
  hardRedirect?: boolean;
};

export const useNavigate = () => {
  const reactRouterNavigate = useReactRouterNavigate();
  const { searchParams } = useSearchParams();

  const navigate = useCallback(
    ({
      route,
      newParams = {},
      clearParams = false,
      hardRedirect = false,
    }: NavigateArgs) => {
      let updatedSearchParams = new URLSearchParams(searchParams.toString());

      if (isBoolean(clearParams) && clearParams) {
        updatedSearchParams = new URLSearchParams();
      } else if (Array.isArray(clearParams)) {
        for (const paramKey of clearParams) {
          const mappedKey = SEARCH_PARAM_MAPPING[paramKey].key;
          updatedSearchParams.delete(mappedKey);
        }
      }

      for (const [key, value] of Object.entries(newParams)) {
        const searchParamKey = key as SearchParamsKeys;
        const mappedKey = SEARCH_PARAM_MAPPING[searchParamKey].key;

        if (value) {
          updatedSearchParams.set(mappedKey, value);
        } else {
          updatedSearchParams.delete(mappedKey);
        }
      }

      if (hardRedirect) {
        const searchString = updatedSearchParams.toString();
        const fullUrl = searchString ? `${route}?${searchString}` : route;
        globalThis.location.replace(fullUrl);
        return;
      }

      reactRouterNavigate({
        pathname: route,
        search: updatedSearchParams.toString(),
      });
    },
    [reactRouterNavigate, searchParams],
  );

  return navigate;
};
