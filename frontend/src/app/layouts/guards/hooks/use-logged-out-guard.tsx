import { type GuardResult } from "@/app/layouts/guards/types";
import { Routes } from "@/app/routes/routes";
import { useAuth } from "@/hooks/use-auth";
import { SearchParamsKeys } from "@/hooks/use-search-params";

export const useLoggedOutGuard = (): GuardResult => {
  const { _loading, authUser } = useAuth();

  if (_loading) {
    return { loading: true };
  }

  if (authUser) {
    return {
      loading: false,
      redirect: {
        route: Routes.Home,
        clearParams: [SearchParamsKeys.Email, SearchParamsKeys.Code],
        hardRedirect: true,
      },
    };
  }

  return { loading: false };
};
