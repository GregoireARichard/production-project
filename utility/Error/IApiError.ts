import { ErrorCode } from './ErrorCode';
import { StructuredErrors } from './StructuredError';

export interface IApiError {
  code: ErrorCode,
  structured: StructuredErrors,
  message?: string,
  details?: any,
}
