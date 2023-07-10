import { Request } from 'express';
import { ApiError } from '../utility/Error/ApiError';
import { ErrorCode } from '../utility/Error/ErrorCode';
import { IAccessToken, IAccessTokenAdmin } from '../types/auth/IAccessToken';
import { JWT } from '../utility/JWT';
import { ACCESS_AUD, ISSUER } from '../routes/AuthController';
import { ADMIN_AUD } from '../routes/AdminController';


export async function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {

  if (securityName === 'jwt') {
    const authheader = request.headers.authorization || '';
    if (!authheader.startsWith('Bearer ')) {
      throw new ApiError(ErrorCode.Unauthorized, 'auth/missing-header', 'Missing authorization header with Bearer token');
    }

    const token = authheader.split('Bearer ')[1];

    const jwt = new JWT();
    let decoded : IAccessToken|undefined;
    try {
      decoded = await jwt.decode(token, {
        issuer: ISSUER,
        audience: ACCESS_AUD,
      });
      
    } catch (err: any) {
      if (err?.name === "TokenExpiredError") {
        
        throw new ApiError(ErrorCode.TokenExpired, 'auth/access-token-expired', 'Access token expired. Try renew it with the renew token.');
      }
      console.log(err);
    }
    
    if (!decoded) {
      throw new ApiError(ErrorCode.Unauthorized, 'auth/invalid-access-token', "Access token could not be decoded");
    }

    if (!decoded.userId) {
      throw new ApiError(ErrorCode.Unauthorized, 'auth/invalid-access-token', "userId was not found in the payload");
    }  

    return Promise.resolve({userId: decoded.userId})
  }
  else if(securityName === "JWTADMIN"){
    const authheader = request.headers.authorization || '';
    if (!authheader.startsWith('Bearer ')) {
      throw new ApiError(ErrorCode.Unauthorized, 'auth/missing-header', 'Missing authorization header with Bearer token');
    }

    const token = authheader.split('Bearer ')[1];

    const jwt = new JWT();
    let decoded : IAccessTokenAdmin |undefined;
    try {
      decoded = await jwt.decode(token, {
        issuer: ISSUER,
        audience: ADMIN_AUD,
      });
      
    } catch (err: any) {
      if (err?.name === "TokenExpiredError") {
        
        throw new ApiError(ErrorCode.TokenExpired, 'auth/access-token-expired', 'Access token expired. Try renew it with the renew token.');
      }
      console.log(err);
    }
    
    if (!decoded) {
      throw new ApiError(ErrorCode.Unauthorized, 'auth/invalid-access-token', "Access token could not be decoded");
    }

    if (!decoded.adminId) {
      throw new ApiError(ErrorCode.Unauthorized, 'auth/invalid-access-token', "adminId was not found in the payload");
    }  

    return Promise.resolve({adminId: decoded.adminId})
  }

  return Promise.reject({});
}
