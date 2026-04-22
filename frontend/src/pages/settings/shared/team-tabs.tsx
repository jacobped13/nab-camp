import { useMemo } from "react";
import { useLocation } from "react-router-dom";

import { Routes } from "@/app/routes/routes";
import { Tabs, TabsList, TabsTrigger } from "@/components/tabs";
import { useAuthorization } from "@/hooks/use-authorization";
import { useNavigate } from "@/hooks/use-navigate";

enum Statuses {
  ACTIVE = "ACTIVE",
  INVITED = "INVITED",
}

export const TeamTabs = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    routes: { teamsRoute, invitesRoute },
  } = useAuthorization();

  const activeTab = useMemo(() => {
    if (location.pathname === Routes.WorkspaceInvites) {
      return Statuses.INVITED;
    }
    return Statuses.ACTIVE;
  }, [location.pathname]);

  return (
    <Tabs value={activeTab} className="mb-4">
      <TabsList className="flex gap-2">
        <TabsTrigger
          disabled={!teamsRoute.allowed}
          onClick={() => navigate({ route: Routes.WorkspaceTeam })}
          value={Statuses.ACTIVE}
        >
          Active
        </TabsTrigger>
        <TabsTrigger
          disabled={!invitesRoute.allowed}
          onClick={() => navigate({ route: Routes.WorkspaceInvites })}
          value={Statuses.INVITED}
        >
          Invited
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
