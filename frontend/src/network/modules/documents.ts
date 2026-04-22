import {
  type CreateDocumentFileUploadUrlsRequestBody,
  type CreateDocumentFileUploadUrlsRequestParam,
  type CreateDocumentFileUploadUrlsResponseBody,
  type CreateDocumentFileUploadUrlsResponseData,
  type ProcessDocumentFileRequestParam,
  type ProcessDocumentFileRequestBody,
  type ProcessDocumentFileResponseBody,
} from "@shared/api-contracts/workspace";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";

import { mutate } from "@/network/base";

const DOCUMENT_MUTATION_KEYS = {
  CREATE_DOWNLOAD_URLS: ["createDownloadUrls"],
  STREAM_DOCUMENT_TO_STORAGE: ["streamDocumentToStorage"],
  PROCESS_DOCUMENTS: ["processDocuments"],
  APPROVE_DOCUMENT: ["approveDocument"],
  REJECT_DOCUMENT: ["rejectDocument"],
};

type CreateDocumentFileUploadUrlsResponseDataWithFile =
  CreateDocumentFileUploadUrlsResponseData & {
    file: File;
  };

export const useDocumentMutations = () => {
  const createDownloadUrls = useMutation({
    mutationKey: DOCUMENT_MUTATION_KEYS.CREATE_DOWNLOAD_URLS,
    mutationFn: ({
      workspaceId,
      body,
    }: {
      workspaceId: CreateDocumentFileUploadUrlsRequestParam;
      body: CreateDocumentFileUploadUrlsRequestBody;
    }) =>
      mutate<
        CreateDocumentFileUploadUrlsResponseBody,
        CreateDocumentFileUploadUrlsRequestBody
      >(`/workspace/${workspaceId.id}/document/file/upload`, {
        method: "POST",
        payload: body,
      }),
  });

  const streamDocumentToStorage = useMutation({
    mutationKey: DOCUMENT_MUTATION_KEYS.STREAM_DOCUMENT_TO_STORAGE,
    mutationFn: async (
      downloadUrlData: CreateDocumentFileUploadUrlsResponseData & {
        file: File;
      },
    ) => {
      const response = await fetch(downloadUrlData.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": downloadUrlData.file.type,
        },
        body: downloadUrlData.file,
      });

      if (!response.ok) {
        throw new Error(
          `Upload failed: ${response.status} ${response.statusText}`,
        );
      }

      return {
        response,
        originalData: downloadUrlData,
      };
    },
  });

  const { mutateAsync: streamDocumentToStorageMutateAsync } =
    streamDocumentToStorage;
  const streamMultipleDocumentsToStorage = useCallback(
    async (data: CreateDocumentFileUploadUrlsResponseDataWithFile[]) => {
      const results = await Promise.allSettled(
        data.map((downloadUrlData) =>
          streamDocumentToStorageMutateAsync(downloadUrlData),
        ),
      );

      const successes = results
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value.originalData);

      const failures = results
        .filter((result) => result.status === "rejected")
        .map((result, index) => ({
          error: (result as PromiseRejectedResult).reason,
          originalData: data[index],
        }));

      return { successes, failures };
    },
    [streamDocumentToStorageMutateAsync],
  );

  const processDocument = useMutation({
    mutationKey: DOCUMENT_MUTATION_KEYS.PROCESS_DOCUMENTS,
    mutationFn: async ({
      workspaceId,
      body,
    }: {
      workspaceId: ProcessDocumentFileRequestParam;
      body: ProcessDocumentFileRequestBody;
    }) => {
      const response = await mutate<
        ProcessDocumentFileResponseBody,
        ProcessDocumentFileRequestBody
      >(`/workspace/${workspaceId.id}/document/file/process`, {
        method: "POST",
        payload: body,
      });

      return {
        response,
        originalData: body,
      };
    },
  });

  const { mutateAsync: processDocumentMutateAsync } = processDocument;
  const processMultipleDocuments = useCallback(
    async (
      workspaceId: string,
      documents: ProcessDocumentFileRequestBody[],
    ) => {
      const results = await Promise.allSettled(
        documents.map((doc) =>
          processDocumentMutateAsync({
            workspaceId: { id: workspaceId },
            body: {
              fileId: doc.fileId,
              fileExtension: doc.fileExtension,
            },
          }),
        ),
      );

      const successes = results
        .filter((result) => result.status === "fulfilled")
        .map((result) => ({
          response: result.value.response,
          originalData: result.value.originalData,
        }));

      const failures = results
        .filter((result) => result.status === "rejected")
        .map((result, index) => ({
          error: (result as PromiseRejectedResult).reason,
          originalData: documents[index],
        }));

      return { successes, failures };
    },
    [processDocumentMutateAsync],
  );

  return {
    createDownloadUrls,
    streamMultipleDocumentsToStorage,
    streamDocumentToStorage,
    processDocument,
    processMultipleDocuments,
  };
};
