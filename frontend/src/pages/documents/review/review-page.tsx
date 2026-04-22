import { DynamicFormInitializer } from "@/pages/documents/review/dynamic-form/dynamic-form-initializer";
import { UploadedDocumentInitializer } from "@/pages/documents/review/uploaded-document/uploaded-document-initializer";

type DocumentReviewPageProps = {
  src: string;
};

export const DocumentReviewPage = ({ src }: DocumentReviewPageProps) => {
  return (
    <div className="flex w-full h-screen">
      <div className="flex-1 overflow-y-auto no-scrollbar p-4">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Review Data</h2>
          <DynamicFormInitializer />
        </div>
      </div>

      <div className="w-0.5 bg-muted flex-shrink-0" />

      <div className="flex-1 overflow-y-auto no-scrollbar p-4">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Uploaded Document</h2>
          <UploadedDocumentInitializer src={src} />
        </div>
      </div>
    </div>
  );
};
