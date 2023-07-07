import { Body, Delete, Get, Path, Post, Put, Query, Route } from 'tsoa';
import { IUser, IUserCreate, IUserUpdate } from '../model/User/IUser';
import { ICreateResponse } from '../types/ICreateResponse';
import { IIndexResponse } from '../types/IIndexQuery';
import { IUpdateResponse } from '../types/IUpdateResponse';
import { ApiError } from "../utility/Error/ApiError";
import { ErrorCode } from "../utility/Error/ErrorCode";
import { Crud } from '../utility/Crud';
import { Email } from "../utility/Email";
import { JWT } from "../utility/JWT";

export const ISSUER = "api-auth";
export const MAGIC_AUD = "api-magic"
export const ACCESS_AUD = "api-access";
export const RENEW_AUD = "api-renew";

const READ_COLUMNS = ['id', 'email'];

/**
 * Un utilisateur de la plateforme.
 */
@Route("/user")
export class UserController {

  /**
   * Récupérer une page d'utilisateurs.
   */
  @Get()
  public async getUsers(
    /** La page (zéro-index) à récupérer */
    @Query() page?: string,    
    /** Le nombre d'éléments à récupérer (max 50) */
    @Query() limit?: string,    
  ): Promise<IIndexResponse<IUser>> {    
    return Crud.Index<IUser>({
      query: { page, limit }, 
      table: 'user', 
      columns: READ_COLUMNS
    });
  }

  /**
   * Créer un nouvel utilisateur
   */
  // @Post()
  // public async createUser(
  //   @Body() body: IUserCreate
  // ): Promise<ICreateResponse> {
  //   return Crud.Create<IUserCreate>({
  //     body: body, 
  //     table: 'user'
  //   });
  // }

  /**
   * register un nouvel user
   */
  @Post('/register')
  public async registerUser(
    @Body() body: IUserCreate
  ): Promise<{ ok: boolean}> {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(body.email)) {
      throw new ApiError(ErrorCode.BadRequest, 'auth/missing-email', "Bad Email");
      }
    const existUser = await Crud.Read<IUser>({
      table: 'user', 
      idKey: 'email', 
      idValue: body.email, 
      columns: READ_COLUMNS
    });
    if(existUser){
      throw new ApiError(ErrorCode.Unauthorized, 'user/register/user-already-exists', "The user is already exist", {userId:existUser.id});
    }
    //on crée l'utilisateur en base 
    const user =  await Crud.Create<IUserCreate>({
      body: body, 
      table: 'user'
    });

        //  Ensuite Create the new JWT (est ce que je ne dois pas le mettre dans un then ?)
        const jwt = new JWT();
        const encoded = await jwt.create({
          userId: user.id,
        }, {
          expiresIn: '30 minutes',
          audience: MAGIC_AUD,
          issuer: ISSUER
        }) as string;

        //Enfin envoi de mail
        const emailer = new Email();
        const link = (process.env.FRONT_URL || 'http://localhost:' + (process.env.PORT || 5050)) + '/auth/login?jwt=' + encodeURIComponent(encoded);
        try {
          await emailer.sendMagicLink(body.email, link, 'Mon service');
        } catch (error) {
          throw new ApiError(ErrorCode.InternalError, 'internal/unknown', `Mailjet Error.`, {linkJwt:link});
        }

        return {
          ok: true
        };

   
  }


  /**
   * Récupérer une utilisateur avec le ID passé dans le URL
   */
  @Get('{userId}')
  public async readUser(
    @Path() userId: number
  ): Promise<IUser> {
    return Crud.Read<IUser>({
      table: 'user', 
      idKey: 'id', 
      idValue: userId, 
      columns: READ_COLUMNS
    });
  }

  /**
   * Mettre à jour un utilisateur avec le ID passé dans le URL
   */
  @Put('{userId}')
  public async updateUser(
    @Path() userId: number,
    @Body() body: IUserUpdate
  ): Promise<IUpdateResponse> {
    return Crud.Update<IUserUpdate>({
      body: body, 
      table: 'user', 
      idKey: 'id', 
      idValue: userId
    });
  }
  
  /**
   * Supprimer un utilisateur
   */
  @Delete('{userId}')
  public async deleteUser(
    @Path() userId: number,
  ): Promise<IUpdateResponse> {
    return Crud.Delete({
      table: 'user', 
      idKey: 'id', 
      idValue: userId
    });
  }

}