import { Page } from "@/app/layouts/page-layouts/page";
import { useAuthorization } from "@/hooks/use-authorization";
import { DetailsPage } from "@/pages/settings/workspace/details/details-page";

export const DetailsInitializer = () => {
  const {
    routes: { workspaceDetailsRoute },
  } = useAuthorization();

  return (
    <Page
      title="Details"
      loading={false}
      permission={workspaceDetailsRoute.allowed}
    >
      <DetailsPage />
    </Page>
  );
};
