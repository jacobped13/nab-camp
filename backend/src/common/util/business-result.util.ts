import assert from 'assert';
import { ExecutionContext } from './request-context.util';
import { ZodError } from 'zod';
import { HTTP_STATUS_CODE } from '../type';

// -----------------------------------------------------------------
// Business Result Error
// -----------------------------------------------------------------

/**
 * Represents generic error codes for business results.
 * These code should match HTTP status codes, but are not directly tied to them.
 */
export enum RESULT_ERROR_CODE {
  VALIDATION_ERROR = 4000,
  PERMISSION_DENIED_ERROR = 4003,
  NOT_FOUND_ERROR = 4004,
  CONFLICT_ERROR = 4009,
  UNPROCESSABLE_ENTITY_ERROR = 4220,
  UNKNOWN_ERROR = 5000,
}

/**
 * Interface for a structured error.
 */
export interface IResultError {
  code: RESULT_ERROR_CODE;
  detail: string;
}

/**
 * Type for additional metadata that can be attached to an error.
 * This can be used to provide more context or debugging information.
 * It is a generic type that defaults to an empty object.
 */
export type ResultErrorMetadata<T extends object = object> = T;

/**
 * Interface for a business error result that includes metadata.
 * This extends the basic error interface with an optional metadata field.
 */
export interface IBusinessErrorResult<M extends ResultErrorMetadata>
  extends IResultError {
  metadata?: ResultErrorMetadata<M>;
}

/**
 * Utility type for creating a structured error DTO with metadata.
 */
export type BusinessErrorResultInput<M extends ResultErrorMetadata> = {
  code: RESULT_ERROR_CODE;
  detail: string;
  metadata?: ResultErrorMetadata<M>;
};

/**
 * Utility class to create a structured error DTO with metadata.
 */
export class BusinessErrorResult {
  /**
   * Utility method to create a structured error DTO.
   */
  public static with<M extends ResultErrorMetadata>(
    input: BusinessErrorResultInput<M>
  ): IBusinessErrorResult<M> {
    return {
      code: input.code,
      detail: input.detail,
      metadata: input.metadata,
    };
  }

  /**
   * Utility method to create a structured error DTO from a ZodError.
   */
  public static fromZodError<M extends ResultErrorMetadata>(
    error: ZodError,
    metadata?: ResultErrorMetadata<M>,
    code: RESULT_ERROR_CODE = RESULT_ERROR_CODE.VALIDATION_ERROR
  ): IBusinessErrorResult<M>[] {
    const flattenedErrors = error.flatten();

    return [
      ...Object.entries(flattenedErrors.fieldErrors).map(
        ([field, messages]) => {
          const mergedMessages = (messages ?? []).join(', ');

          return {
            code: code,
            detail: field + ' - ' + mergedMessages,
            metadata: metadata,
          };
        }
      ),
      ...Object.entries(flattenedErrors.formErrors).map(([_, message]) => ({
        code: code,
        detail: message,
        metadata: metadata,
      })),
    ];
  }
}

// -----------------------------------------------------------------
// Business Result
// -----------------------------------------------------------------

/**
 * Abstract class representing a business result.
 *
 * It encapsulates the result of a business operation,
 * which can either be a success with data or a failure with errors.
 */
export abstract class BusinessResult<T, E extends IResultError> {
  public readonly _success: boolean;
  public readonly _data: T | undefined;
  public readonly _errors: E[] | undefined;

  protected constructor(
    success: boolean,
    data: T | undefined,
    errors: E[] | undefined
  ) {
    this._success = success;
    this._data = data;
    this._errors = errors;
  }

  public hasErrors(): this is {
    _errors: E[];
  } {
    return !!this._errors?.length;
  }

  public isSuccess(): this is {
    _success: true;
    _data: T;
  } {
    return this._success;
  }

  public isPartialSuccess(): this is {
    _success: true;
    _data: T;
    _errors: E[];
  } {
    return this._success && this.hasErrors();
  }

  public isFailure(): this is {
    _success: false;
    _errors: E[];
  } {
    return !this._success;
  }

  public get errors(): E[] {
    assert(this.hasErrors(), 'BusinessResult does not have any errors');
    return this._errors as E[];
  }

  public get data(): T {
    assert(this.isSuccess(), 'BusinessResult is not successful');
    return this._data as T;
  }

  public get firstError(): E {
    return this.errors[0];
  }

  public static ok<T, E extends IResultError>(value: T): BusinessResult<T, E> {
    return new Success(value);
  }

  public static fail<T, E extends IResultError>(
    ...errors: E[]
  ): BusinessResult<T, E> {
    return new Failure(errors);
  }

  public static partial<T, E extends IResultError>(
    value: T,
    errors: E[]
  ): BusinessResult<T, E> {
    return new PartialSuccess(value, errors);
  }

  public static fromMultiResult<T, TA extends T[], E extends IResultError>(
    data: TA,
    errors: E[]
  ): BusinessResult<TA, E> {
    // If there are no successful results and no errors, return a failure
    if (data.length && !errors.length) {
      return BusinessResult.ok(data);
    }

    // If there are no successful results but there are errors, return a failure
    if (!data.length && errors.length) {
      return BusinessResult.fail(...errors);
    }

    // If there are both successful results and errors, return a partial success
    return BusinessResult.partial(data, errors);
  }
}

// -----------------------------------------------------------------
// Business Result Outcomes
// -----------------------------------------------------------------

/**
 * A concrete class representing a successful result.
 */
class Success<T, E extends IResultError> extends BusinessResult<T, E> {
  constructor(value: T) {
    super(true, value, undefined);
  }
}

/**
 * A concrete class representing a failed result.
 */
export class Failure<T, E extends IResultError> extends BusinessResult<T, E> {
  constructor(errors: E[]) {
    super(false, undefined, errors);
  }
}

/**
 * A concrete class representing a partially successful result.
 * It contains both a value and an array of errors.
 */
export class PartialSuccess<T, E extends IResultError> extends BusinessResult<
  T,
  E
> {
  constructor(value: T, errors: E[]) {
    super(true, value, errors);
  }
}

// -----------------------------------------------------------------
// Business Result Utils
// -----------------------------------------------------------------

/**
 * Utility type that creates a structured error DTO with metadata containing the execution context.
 */
export type BusinessResultContextErrorDto = IBusinessErrorResult<
  ResultErrorMetadata<{
    context: ExecutionContext;
  }>
>;

/**
 * Utility type that creates structured error metadata containing the input
 * and the execution context.
 */
export type BusinessResultInputContextErrorMetadataDto<I> =
  ResultErrorMetadata<{
    input: I;
    context: ExecutionContext;
  }>;

/**
 * Utility type that creates a structured error DTO with metadata containing the input
 * and the execution context.
 */
export type BusinessResultInputContextErrorDto<I> = IBusinessErrorResult<
  BusinessResultInputContextErrorMetadataDto<I>
>;

/**
 * Mapping between generic business error codes and HTTP status codes.
 */
export const RESULT_ERROR_CODE_TO_HTTP_STATUS_CODE_MAP: Partial<
  Record<RESULT_ERROR_CODE, HTTP_STATUS_CODE>
> = {
  [RESULT_ERROR_CODE.VALIDATION_ERROR]: HTTP_STATUS_CODE.BAD_REQUEST,
  [RESULT_ERROR_CODE.PERMISSION_DENIED_ERROR]: HTTP_STATUS_CODE.FORBIDDEN,
  [RESULT_ERROR_CODE.NOT_FOUND_ERROR]: HTTP_STATUS_CODE.NOT_FOUND,
  [RESULT_ERROR_CODE.CONFLICT_ERROR]: HTTP_STATUS_CODE.CONFLICT,
  [RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR]:
    HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY,
  [RESULT_ERROR_CODE.UNKNOWN_ERROR]: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
};

/**
 * Transforms a business error code to a HTTP status code.
 */
export const transformResultErrorCodeToHTTPStatusCode = (
  code: RESULT_ERROR_CODE,
  defaultCode: HTTP_STATUS_CODE = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
): HTTP_STATUS_CODE => {
  return RESULT_ERROR_CODE_TO_HTTP_STATUS_CODE_MAP[code] ?? defaultCode;
};
