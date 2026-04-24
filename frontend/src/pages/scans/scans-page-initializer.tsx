import { Page } from "@/app/layouts/page-layouts/page";
import { ScansPage } from "@/pages/scans/scans-page";

export const ScansPageInitializer = () => {
  return (
    <Page loading={false} title="Scans">
      <ScansPage />
    </Page>
  );
};
