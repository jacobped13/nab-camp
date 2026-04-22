import { useEffect, useRef } from "react";

import { type NavigateArgs, useNavigate } from "@/hooks/use-navigate";

export const Redirect = ({
  route,
  newParams = {},
  clearParams = true,
  hardRedirect = false,
}: NavigateArgs) => {
  const navigate = useNavigate();
  const isRedirecting = useRef<boolean>(false);

  useEffect(() => {
    if (isRedirecting.current) return;
    isRedirecting.current = true;

    navigate({
      route,
      newParams,
      clearParams,
      hardRedirect,
    });
  }, [navigate, route, newParams, clearParams, hardRedirect]);

  return null;
};
