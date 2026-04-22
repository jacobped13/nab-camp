import { HTTPException as InternalHTTPExecption } from 'hono/http-exception';
import { getReasonPhrase, HTTP_STATUS_CODE } from '../type/http.type';
import { ContentfulStatusCode } from 'hono/utils/http-status';
import { ErrorResponseBody } from '@api-contracts/common';

export class HTTPException extends InternalHTTPExecption {
  constructor(statusCode: HTTP_STATUS_CODE, message?: string) {
    super(statusCode as ContentfulStatusCode, {
      message: message,
    });
  }

  public toJSONResponse(): Response {
    const responseBody: ErrorResponseBody = {
      status: this.status,
      title: getReasonPhrase(this.status),
      detail: this.message,
    };

    return new Response(JSON.stringify(responseBody), {
      status: this.status,
      statusText: getReasonPhrase(this.status),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export class BadRequestException extends HTTPException {
  constructor(message?: string) {
    super(HTTP_STATUS_CODE.BAD_REQUEST, message);
  }
}

export class NotFoundException extends HTTPException {
  constructor(message?: string) {
    super(HTTP_STATUS_CODE.NOT_FOUND, message);
  }
}

export class UnauthorizedException extends HTTPException {
  constructor(message?: string) {
    super(HTTP_STATUS_CODE.UNAUTHORIZED, message);
  }
}

export class InternalServerErrorException extends HTTPException {
  constructor(message?: string) {
    super(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR, message);
  }
}
