import { ErrorCode } from './ErrorCode';
import { StructuredErrors } from './StructuredError';
import { IApiError } from './IApiError';

export class ApiError {
  constructor(public httpCode: ErrorCode, public structuredError: StructuredErrors, public errMessage: string, public errDetails?: any) {
  }

  get json(): IApiError {
    return {
      code: this.httpCode,
      structured: this.structuredError,
      message: this.errMessage,
      details: this.errDetails
    }
  }
}
