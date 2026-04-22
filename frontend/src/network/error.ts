import {
  type BulkOperationError,
  type ErrorResponseBody,
} from "@shared/api-contracts/common";
import { type AxiosError } from "axios";
import { isEmpty } from "lodash-es";
import { toast } from "sonner";

export const handleError = (e: unknown) => {
  const error = e as AxiosError<ErrorResponseBody>;
  const { detail } = error.response?.data || {};

  toast.error(
    detail || "An unexpected error occurred. Please try again later.",
  );

  console.error(error);
};

export const handleBulkError = <T extends BulkOperationError>({
  errors,
}: {
  errors: T[];
}) => {
  if (isEmpty(errors)) return;

  for (const error of errors) {
    const { detail } = error;
    toast.error(
      detail || "An unexpected error occurred while processing the request.",
    );
  }
};
