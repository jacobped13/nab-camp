import { useState } from "react";

import { Page } from "@/app/layouts/page-layouts/page";
import { Routes } from "@/app/routes/routes";
import { CompletePage } from "@/pages/documents/upload/complete-page";
import { UploadSteps } from "@/pages/documents/upload/consts";
import { DocumentUploadPage } from "@/pages/documents/upload/upload-page";

export const DocumentUploadPageInitializer = () => {
  const [activeUploadStep, setActiveUploadStep] = useState<UploadSteps>(
    UploadSteps.SELECT_FILES,
  );

  const [failedFileUploads, setFailedFileUploads] = useState<File[]>([]);

  return (
    <Page
      title="Upload Documents"
      breadcrumbs={[
        {
          to: Routes.Documents,
          label: "Documents",
        },
      ]}
      loading={false}
    >
      {activeUploadStep === UploadSteps.SELECT_FILES && (
        <DocumentUploadPage
          setActiveUploadStep={setActiveUploadStep}
          setFailedFileUploads={setFailedFileUploads}
        />
      )}
      {activeUploadStep === UploadSteps.COMPLETE && (
        <CompletePage
          setActiveUploadStep={setActiveUploadStep}
          failedFileUploads={failedFileUploads}
        />
      )}
    </Page>
  );
};
