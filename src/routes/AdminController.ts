import { Post, Route, Body, Security } from "tsoa";
import { IAdminConnectionRequest } from "../types/IAdminConnectionRequest";
import { ApiError } from "../utility/Error/ApiError";
import { ErrorCode } from "../utility/Error/ErrorCode";
import { checkIfAdminAccountIsValid, getAdmin } from "../utility/repository";
import { IAdminLoginResponse } from "../types/IAdminLoginResponse";
import { JWT } from "../utility/JWT";
import { ISSUER, MAGIC_AUD } from "./AuthController";

export const ADMIN_AUD = "api-admin"
@Route("/admin")
export class AdminController {
    @Post("/login")
    public async loginAdmin(
        @Body() body: IAdminConnectionRequest
    ): Promise<IAdminLoginResponse >{
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(body.email)) {
            throw new ApiError(ErrorCode.BadRequest, 'auth/missing-email', "Bad Email");
        }
        const testFunc = await checkIfAdminAccountIsValid(body)
        const adminId = await getAdmin(body.email)
        const jwt = new JWT()
          const encoded = await jwt.create({
            adminId: adminId,
          }, {
            expiresIn: '30 minutes',
            audience: ADMIN_AUD,
            issuer: ISSUER
          }) as string;
        if (testFunc){
            return {
                jwt: encoded,
            }
        }else{
            throw new ApiError(ErrorCode.Unauthorized, 'validation/failed', 'invaid login')
        }
    }
}

