import { Page } from "@/app/layouts/page-layouts/page";
import { Routes } from "@/app/routes/routes";
import { DocumentReviewPage } from "@/pages/documents/review/review-page";
import w2 from "@/pages/documents/review/uploaded-document/w2.png";

export const DocumentReviewPageInitializer = () => {
  return (
    <Page
      title="Review Document"
      breadcrumbs={[
        {
          to: Routes.Documents,
          label: "Documents",
        },
      ]}
      loading={false}
    >
      <DocumentReviewPage src={w2} />
    </Page>
  );
};
