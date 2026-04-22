import { DocumentMimeType, ImageMimeType } from "@shared/lib/file-types";
import { formatBytes, SIZE_BINARY } from "@shared/lib/size";
import { TIMING } from "@shared/lib/timing";
import { isEmpty } from "lodash-es";
import { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/button";
import { ComposedFileUploader } from "@/components/file-upload";
import { Progress } from "@/components/progress";
import { useAccount } from "@/hooks/use-account";
import { handleError } from "@/network/error";
import { useDocumentMutations } from "@/network/modules/documents";
import { UploadSteps } from "@/pages/documents/upload/consts";

const MAX_FILE_COUNT = 25;
const MAX_FILE_SIZE = SIZE_BINARY.MEGABYTE.IN_BYTES * 2;
const ACCEPTED_FILE_TYPES = [
  DocumentMimeType.PDF,
  ImageMimeType.JPEG,
  ImageMimeType.PNG,
];

const totalFileSize = (files: File[]) => {
  const bytes = files.reduce((total, file) => total + file.size, 0);
  return { humanReadable: formatBytes({ bytes }), number: bytes };
};

type DocumentUploadPageProps = {
  setActiveUploadStep: (step: UploadSteps) => void;
  setFailedFileUploads: (files: File[]) => void;
};

export const DocumentUploadPage = ({
  setActiveUploadStep,
  setFailedFileUploads,
}: DocumentUploadPageProps) => {
  const {
    defaultWorkspace: {
      workspace: { id: workspaceId },
    },
  } = useAccount();
  const {
    createDownloadUrls,
    streamMultipleDocumentsToStorage,
    processMultipleDocuments,
  } = useDocumentMutations();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [progressValue, setProgressValue] = useState<number>(0);

  const handleFileUploaded = useCallback((files: File[]) => {
    setUploadedFiles(files);
  }, []);

  const simulateProgress = useCallback(() => {
    const AVERAGE_UPLOAD_SPEED = SIZE_BINARY.MEGABYTE.IN_BYTES;
    const INTERVAL_MS = TIMING.SECOND.IN_MILLISECONDS;
    const MAX_PROGRESS = 95;

    const { number } = totalFileSize(uploadedFiles);
    const estimatedSeconds = number / AVERAGE_UPLOAD_SPEED;

    const increment =
      MAX_PROGRESS /
      ((estimatedSeconds * TIMING.SECOND.IN_MILLISECONDS) / INTERVAL_MS);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += increment;
      if (currentProgress >= MAX_PROGRESS) {
        setProgressValue(MAX_PROGRESS);
        clearInterval(interval);
      } else {
        setProgressValue(currentProgress);
      }
    }, INTERVAL_MS);

    return () => clearInterval(interval);
  }, [uploadedFiles]);

  const handleSubmit = useCallback(async () => {
    try {
      simulateProgress();
      setIsSubmitting(true);

      const filesMappedToRequestIds = uploadedFiles.map((file) => ({
        mimeType: file.type as DocumentMimeType,
        requestId: uuidv4(),
        file,
      }));

      const filesMappedToRequestIdsWithFile = uploadedFiles.map(
        (file, index) => ({
          ...filesMappedToRequestIds[index],
          file,
        }),
      );

      // Create download URLs for the uploaded files
      const { data: urlSuccesses, errors: urlFailures } =
        await createDownloadUrls.mutateAsync({
          workspaceId: { id: workspaceId },
          body: {
            files: filesMappedToRequestIds,
          },
        });

      // Map the uploaded files to their corresponding download URLs
      const filesMappedToDownloadUrls = urlSuccesses
        .map((url) => ({
          ...url,
        }))
        .filter(Boolean);

      // Stream files to GCS bucket
      const { successes: streamSuccesses, failures: streamFailures } =
        await streamMultipleDocumentsToStorage(
          filesMappedToDownloadUrls.map((url, index) => ({
            ...url,
            file: uploadedFiles[index],
          })),
        );

      // Process the documents
      const { failures: processFailures } = await processMultipleDocuments(
        workspaceId,
        streamSuccesses.map((success) => ({
          fileId: success.fileId,
          fileExtension: success.fileExtension,
        })),
      );

      // Collect all errors
      const failedFileUploads = [
        // failed due to URL creation
        ...urlFailures.map(
          (error) =>
            filesMappedToRequestIdsWithFile.find(
              (file) => file.requestId === error.metadata?.requestId,
            )?.file,
        ),

        // failed due to streaming
        ...streamFailures.map((failure) => failure.originalData.file),

        // failed due to processing
        ...processFailures.map(
          (failure) =>
            streamSuccesses.find(
              (success) => success.fileId === failure.originalData.fileId,
            )?.file,
        ),
      ].filter((file) => !!file);

      setFailedFileUploads(failedFileUploads);
      setProgressValue(100);
      setActiveUploadStep(UploadSteps.COMPLETE);
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    uploadedFiles,
    createDownloadUrls,
    streamMultipleDocumentsToStorage,
    processMultipleDocuments,
    workspaceId,
    setActiveUploadStep,
    simulateProgress,
    setFailedFileUploads,
  ]);

  return (
    <div className="relative h-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-medium text-sm">
            {uploadedFiles.length} files selected
          </span>
          <span className="text-xs text-muted-foreground">
            {totalFileSize(uploadedFiles).humanReadable}
          </span>
        </div>
        <Button
          disabled={isEmpty(uploadedFiles)}
          loading={isSubmitting}
          onClick={handleSubmit}
          size="sm"
        >
          Upload
        </Button>
      </div>
      {isSubmitting && <Progress value={progressValue} />}
      <ComposedFileUploader
        maxFiles={MAX_FILE_COUNT}
        maxSize={MAX_FILE_SIZE}
        acceptedFileTypes={ACCEPTED_FILE_TYPES}
        disabled={isSubmitting}
        onFilesChange={handleFileUploaded}
      />
    </div>
  );
};
