import { Page } from "@/app/layouts/page-layouts/page";
import { DocumentPage } from "@/pages/documents/document-page";

export const DocumentPageInitializer = () => {
  return (
    <Page title="Documents" loading={false}>
      <DocumentPage />
    </Page>
  );
};
