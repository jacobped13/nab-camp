import { isEmpty } from "lodash-es";
import { AlertCircleIcon } from "lucide-react";

import { Routes } from "@/app/routes/routes";
import { Alert, AlertDescription, AlertTitle } from "@/components/alert";
import { Button } from "@/components/button";
import { useNavigate } from "@/hooks/use-navigate";
import { UploadSteps } from "@/pages/documents/upload/consts";

type CompletePageProps = {
  setActiveUploadStep: (step: UploadSteps) => void;
  failedFileUploads: File[];
};

export const CompletePage = ({
  setActiveUploadStep,
  failedFileUploads,
}: CompletePageProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-lg font-semibold">Upload Complete</h2>
        <p className="text-sm text-muted-foreground">
          Your documents have been successfully uploaded.
        </p>
      </div>
      {!isEmpty(failedFileUploads) && (
        <Alert variant="destructive" className="w-full max-w-md space-y-2">
          <AlertCircleIcon />
          <AlertTitle>
            Some files failed to upload. Please try again.
          </AlertTitle>
          <AlertDescription>
            <ul className="list-inside list-disc text-sm">
              {failedFileUploads.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      <div className="space-x-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setActiveUploadStep(UploadSteps.SELECT_FILES)}
        >
          Upload More
        </Button>
        <Button onClick={() => navigate({ route: Routes.Documents })} size="sm">
          Go to Documents
        </Button>
      </div>
    </div>
  );
};
